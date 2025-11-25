import { supabase } from './supabase';

export interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  shops: {
    shop_name: string;
  };
  likes_count: number;
}

/**
 * Get product recommendations based on liked items
 * Returns similar products from the same categories
 */
export async function getRecommendedProducts(
  userId: string,
  limit: number = 6
): Promise<RecommendedProduct[]> {
  try {
    // Get user's liked products
    const { data: likedProducts } = await supabase
      .from('likes')
      .select('product_id')
      .eq('user_id', userId);

    if (!likedProducts || likedProducts.length === 0) {
      // If no likes, return trending products instead
      const { data: trending } = await supabase
        .from('products')
        .select('*, shops(shop_name)')
        .order('likes_count', { ascending: false })
        .limit(limit);

      return (trending as RecommendedProduct[]) || [];
    }

    const likedProductIds = likedProducts.map(lp => lp.product_id);

    // Get categories of liked products
    const { data: likedProductDetails } = await supabase
      .from('products')
      .select('category')
      .in('id', likedProductIds);

    const categoryArray = likedProductDetails?.map(p => p.category) || [];
    const categoriesSet = new Set(categoryArray);
    const categories = Array.from(categoriesSet);

    if (categories.length === 0) {
      // Fallback to popular products
      const { data: popular } = await supabase
        .from('products')
        .select('*, shops(shop_name)')
        .order('likes_count', { ascending: false })
        .limit(limit);

      return (popular as RecommendedProduct[]) || [];
    }

    // Get products from similar categories, excluding already liked ones
    const { data: recommendations } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .in('category', categories)
      .not('id', 'in', `(${likedProductIds.join(',')})`)
      .order('likes_count', { ascending: false })
      .limit(limit);

    return (recommendations as RecommendedProduct[]) || [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}

/**
 * Get trending products based on likes count
 */
export async function getTrendingProducts(limit: number = 8): Promise<RecommendedProduct[]> {
  try {
    const { data } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .order('likes_count', { ascending: false })
      .limit(limit);

    return (data as RecommendedProduct[]) || [];
  } catch (error) {
    console.error('Error getting trending products:', error);
    return [];
  }
}

/**
 * Get related products by category
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<RecommendedProduct[]> {
  try {
    // Get the category of the current product
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category')
      .eq('id', productId)
      .single();

    if (!currentProduct) {
      return [];
    }

    // Get products from the same category, excluding current product
    const { data: related } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .eq('category', currentProduct.category)
      .neq('id', productId)
      .limit(limit);

    return (related as RecommendedProduct[]) || [];
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
}
