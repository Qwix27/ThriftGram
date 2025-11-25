import { supabase } from './supabase';
import { extractTagsFromProducts, getProductsByTags, getProductTags } from './tags';

/**
 * Scoring weights for the recommendation algorithm
 * Higher weight = more important
 */
const RECOMMENDATION_WEIGHTS = {
  liked: 3,           // Product in likes gets 3x weight
  cartItem: 2.5,      // Product in cart gets 2.5x weight
  purchased: 2,       // Previously purchased product gets 2x weight
  tagMatch: 1,        // Each tag match gets 1 point
  baseScore: 0.5,     // Base score for all products
};

interface UserPreferences {
  likedProductIds: string[];
  cartProductIds: string[];
  purchasedProductIds: string[];
}

interface RecommendationScore {
  productId: string;
  score: number;
  matchedTags: string[];
  reason: string; // Why this product was recommended
}

/**
 * MAIN ALGORITHM: Get recommendations based on user behavior and tags
 * 
 * Logic:
 * 1. Fetch user's liked, cart, and purchased products
 * 2. Extract all tags from these products
 * 3. Find products with matching tags (excluding user's own products)
 * 4. Score each product based on:
 *    - Tag overlap with liked/cart/purchased items
 *    - User interaction weight (liked > cart > purchased)
 *    - Product popularity (likes_count)
 * 5. Return top N products sorted by score
 */
export async function getPersonalizedFeedRecommendations(
  userId: string,
  limit: number = 12
): Promise<any[]> {
  try {
    // Step 1: Fetch user preferences
    const preferences = await fetchUserPreferences(userId);

    // If user has no interaction history, return trending products
    if (
      preferences.likedProductIds.length === 0 &&
      preferences.cartProductIds.length === 0 &&
      preferences.purchasedProductIds.length === 0
    ) {
      return getTrendingFallback(limit);
    }

    // Step 2: Extract all interaction product IDs
    const interactionProductIds = [
      ...preferences.likedProductIds,
      ...preferences.cartProductIds,
      ...preferences.purchasedProductIds,
    ];

    // Step 3: Get tags from all interaction products
    const allTags = await getTagsFromProductList(interactionProductIds);

    if (allTags.length === 0) {
      // If no tags, fallback to category-based recommendations
      return getTrendingFallback(limit);
    }

    // Step 4: Score all products
    const recommendationScores = await scoreProductsByTags(
      userId,
      allTags,
      preferences,
      limit * 3 // Get more candidates than needed
    );

    // Step 5: Exclude user's own interaction products
    const filteredScores = recommendationScores.filter(
      score => !interactionProductIds.includes(score.productId)
    );

    // Step 6: Fetch product details for top recommendations
    const topRecommendations = filteredScores.slice(0, limit);
    const productIds = topRecommendations.map(r => r.productId);

    if (productIds.length === 0) {
      return getTrendingFallback(limit);
    }

    const { data: products } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .in('id', productIds);

    if (!products) return [];

    // Merge product data with scores
    const recommendedProducts = products.map(product => ({
      ...product,
      _recommendationScore: topRecommendations.find(r => r.productId === product.id),
    }));

    // Sort by score
    return recommendedProducts.sort(
      (a, b) => (b._recommendationScore?.score || 0) - (a._recommendationScore?.score || 0)
    );
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return getTrendingFallback(limit);
  }
}

/**
 * Fetch user's interaction history
 */
async function fetchUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const [likedData, cartData, ordersData] = await Promise.all([
      // Get liked products
      supabase
        .from('likes')
        .select('product_id')
        .eq('user_id', userId),

      // Get cart items
      supabase
        .from('carts')
        .select('product_id')
        .eq('user_id', userId),

      // Get purchased products from orders
      supabase
        .from('orders')
        .select('items')
        .eq('user_id', userId),
    ]);

    const likedProductIds = likedData.data?.map(l => l.product_id) || [];
    const cartProductIds = cartData.data?.map(c => c.product_id) || [];

    // Extract product IDs from order items (JSON array)
    const purchasedProductIds = new Set<string>();
    ordersData.data?.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.id) purchasedProductIds.add(item.id);
        });
      }
    });

    return {
      likedProductIds,
      cartProductIds,
      purchasedProductIds: Array.from(purchasedProductIds),
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return {
      likedProductIds: [],
      cartProductIds: [],
      purchasedProductIds: [],
    };
  }
}

/**
 * Get unique tags from a list of products
 */
async function getTagsFromProductList(productIds: string[]): Promise<string[]> {
  try {
    if (productIds.length === 0) return [];

    const { data: tagData } = await supabase
      .from('product_tags')
      .select('tag')
      .in('product_id', productIds);

    const uniqueTags = new Set((tagData || []).map(t => t.tag));
    return Array.from(uniqueTags);
  } catch (error) {
    console.error('Error getting tags from product list:', error);
    return [];
  }
}

/**
 * Score products based on tag matches and user interaction
 */
async function scoreProductsByTags(
  userId: string,
  tags: string[],
  preferences: UserPreferences,
  limit: number
): Promise<RecommendationScore[]> {
  try {
    // Get all products that have matching tags
    const { data: tagMatches } = await supabase
      .from('product_tags')
      .select('product_id, tag')
      .in('tag', tags);

    if (!tagMatches || tagMatches.length === 0) {
      return [];
    }

    // Build product scores
    const productScores: Record<string, RecommendationScore> = {};

    tagMatches.forEach(match => {
      if (!productScores[match.product_id]) {
        productScores[match.product_id] = {
          productId: match.product_id,
          score: RECOMMENDATION_WEIGHTS.baseScore,
          matchedTags: [],
          reason: 'Tag-based match',
        };
      }

      // Add tag match score
      productScores[match.product_id].score += RECOMMENDATION_WEIGHTS.tagMatch;
      productScores[match.product_id].matchedTags.push(match.tag);
    });

    // Boost scores based on user interaction with similar products
    preferences.likedProductIds.forEach(productId => {
      if (productScores[productId]) {
        productScores[productId].score *= RECOMMENDATION_WEIGHTS.liked;
        productScores[productId].reason = 'Similar to liked items';
      }
    });

    preferences.cartProductIds.forEach(productId => {
      if (productScores[productId]) {
        productScores[productId].score *= RECOMMENDATION_WEIGHTS.cartItem;
        productScores[productId].reason = 'Similar to cart items';
      }
    });

    preferences.purchasedProductIds.forEach(productId => {
      if (productScores[productId]) {
        productScores[productId].score *= RECOMMENDATION_WEIGHTS.purchased;
        productScores[productId].reason = 'Similar to purchased items';
      }
    });

    // Fetch popularity scores and adjust
    const productIds = Object.keys(productScores);
    const { data: products } = await supabase
      .from('products')
      .select('id, likes_count')
      .in('id', productIds);

    (products || []).forEach(product => {
      if (productScores[product.id]) {
        // Add popularity bonus (normalized)
        const popularityBonus = (product.likes_count || 0) * 0.1;
        productScores[product.id].score += popularityBonus;
      }
    });

    // Sort and return top products
    return Object.values(productScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error scoring products:', error);
    return [];
  }
}

/**
 * Fallback: Return trending products when user has no history
 */
async function getTrendingFallback(limit: number): Promise<any[]> {
  try {
    const { data } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .order('likes_count', { ascending: false })
      .limit(limit);

    return (data || []) as any[];
  } catch (error) {
    console.error('Error getting trending fallback:', error);
    return [];
  }
}

/**
 * Get similar products to a given product (for product page recommendations)
 */
export async function getSimilarProducts(productId: string, limit: number = 5): Promise<any[]> {
  try {
    // Get tags of the reference product
    const { data: referenceTags } = await supabase
      .from('product_tags')
      .select('tag')
      .eq('product_id', productId);

    if (!referenceTags || referenceTags.length === 0) {
      // No tags, return random products
      const { data } = await supabase
        .from('products')
        .select('*, shops(shop_name)')
        .neq('id', productId)
        .limit(limit);
      return (data || []) as any[];
    }

    const tagList = referenceTags.map(t => t.tag);

    // Get products with matching tags
    const { data: matchedTags } = await supabase
      .from('product_tags')
      .select('product_id')
      .in('tag', tagList)
      .neq('product_id', productId);

    if (!matchedTags || matchedTags.length === 0) {
      const { data } = await supabase
        .from('products')
        .select('*, shops(shop_name)')
        .neq('id', productId)
        .limit(limit);
      return (data || []) as any[];
    }

    // Get unique product IDs
    const productIdSet = new Set(matchedTags.map(m => m.product_id));
    const productIds = Array.from(productIdSet).slice(0, limit);

    const { data: products } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .in('id', productIds);

    return (products || []) as any[];
  } catch (error) {
    console.error('Error getting similar products:', error);
    return [];
  }
}
