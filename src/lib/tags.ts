import { supabase } from './supabase';

/**
 * Predefined tag categories for products
 * Sellers choose tags from these categories
 */
export const TAG_CATEGORIES = {
  style: ['Vintage', 'Streetwear', 'Formal', 'Casual', 'Bohemian', 'Minimalist', 'Y2K', 'Grunge', 'Preppy', 'Retro'],
  material: ['Cotton', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather', 'Polyester', 'Velvet', 'Corduroy', 'Suede'],
  season: ['Summer', 'Winter', 'Spring', 'Fall', 'All-Season'],
  size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One-Size'],
  type: ['Shirt', 'Pants', 'Dress', 'Jacket', 'Skirt', 'Sweater', 'T-Shirt', 'Shorts', 'Coat', 'Blazer', 'Jeans', 'Hoodie'],
  color: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray', 'Multicolor'],
  condition: ['Like-New', 'Excellent', 'Good', 'Fair', 'Well-Loved'],
  vibe: ['Trendy', 'Classic', 'Edgy', 'Comfortable', 'Luxury', 'Eco-Friendly', 'Unique', 'Statement'],
};

export type TagCategory = keyof typeof TAG_CATEGORIES;

export interface ProductTag {
  id?: string;
  product_id: string;
  tag: string;
  category: TagCategory;
}

/**
 * Add tags to a product
 */
export async function addProductTags(productId: string, tags: Array<{ tag: string; category: TagCategory }>) {
  try {
    const tagsToInsert = tags.map(t => ({
      product_id: productId,
      tag: t.tag,
      category: t.category,
    }));

    const { error } = await supabase
      .from('product_tags')
      .insert(tagsToInsert);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding product tags:', error);
    throw error;
  }
}

/**
 * Get tags for a product
 */
export async function getProductTags(productId: string): Promise<ProductTag[]> {
  try {
    const { data, error } = await supabase
      .from('product_tags')
      .select('*')
      .eq('product_id', productId);

    if (error) throw error;
    return (data || []) as ProductTag[];
  } catch (error) {
    console.error('Error fetching product tags:', error);
    return [];
  }
}

/**
 * Update tags for a product (delete old, insert new)
 */
export async function updateProductTags(productId: string, tags: Array<{ tag: string; category: TagCategory }>) {
  try {
    // Delete old tags
    await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', productId);

    // Insert new tags
    if (tags.length > 0) {
      await addProductTags(productId, tags);
    }

    return true;
  } catch (error) {
    console.error('Error updating product tags:', error);
    throw error;
  }
}

/**
 * Get products by tags (with scoring)
 */
export async function getProductsByTags(tagNames: string[], limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('product_tags')
      .select('product_id, tag')
      .in('tag', tagNames);

    if (error) throw error;

    // Count tag matches per product
    const productScores: Record<string, number> = {};
    (data || []).forEach(row => {
      productScores[row.product_id] = (productScores[row.product_id] || 0) + 1;
    });

    // Get product details sorted by score
    const productIds = Object.entries(productScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (productIds.length === 0) return [];

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .in('id', productIds);

    if (productsError) throw productsError;

    return (products || []) as any[];
  } catch (error) {
    console.error('Error getting products by tags:', error);
    return [];
  }
}

/**
 * Extract unique tags from product list
 */
export function extractTagsFromProducts(productTags: ProductTag[][]): string[] {
  const tagSet = new Set<string>();
  productTags.forEach(tags => {
    tags.forEach(t => tagSet.add(t.tag));
  });
  return Array.from(tagSet);
}
