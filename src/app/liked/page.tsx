'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import LikeButton from '@/components/LikeButton';
import { Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  shops: {
    shop_name: string;
  };
}

export default function LikedProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedProducts();
  }, []);

  const loadLikedProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data: likes } = await supabase
        .from('product_likes')
        .select('product_id')
        .eq('user_id', user.id);

      if (likes && likes.length > 0) {
        const productIds = likes.map(like => like.product_id);
        
        const { data: productsData } = await supabase
          .from('products')
          .select('*, shops(shop_name)')
          .in('id', productIds);

        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error loading liked products:', error);
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500 fill-red-500" size={32} />
          <h1 className="text-4xl font-bold uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Liked Products
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No liked products yet</h2>
            <p className="text-gray-600 mb-6">Start exploring and save your favorites!</p>
            <Link
              href="/shop/all"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 uppercase font-medium"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}