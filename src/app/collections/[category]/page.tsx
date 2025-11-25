'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [params.category]);

  const loadProducts = async () => {
    const category = String(params.category).charAt(0).toUpperCase() + String(params.category).slice(1);
    
    const { data } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .eq('category', category)
      .order('created_at', { ascending: false });

    setProducts(data || []);
    setLoading(false);
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
          {params.category}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} className="group">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={18} />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{product.shops.shop_name}</p>
                <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
                <p className="font-bold">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}