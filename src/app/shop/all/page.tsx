'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LikeButton from '../../../components/LikeButton';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  shop_id: string;
  likes_count: number;
  shops: {
    shop_name: string;
  };
}

export default function ShopAllPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, shops(shop_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          All Products
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Like Button - Top Right Corner */}
                    <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md">
                      <LikeButton productId={product.id} size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{product.shops.shop_name}</p>
                    <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
                    <p className="font-bold">₹{product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}