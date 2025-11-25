'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LikeButton from '@/components/LikeButton';
import { Search, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  shops: {
    shop_name: string;
  };
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shops.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, shops(shop_name)')
        .order('created_at', { ascending: false });

      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories, or shops..."
              className="w-full pl-14 pr-12 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-black focus:outline-none transition-colors"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : searchQuery.trim() ? (
          <>
            <p className="text-gray-600 mb-6">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-gray-600">Try searching for something else</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
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
          </>
        ) : (
          <div className="text-center py-20">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Search Products</h2>
            <p className="text-gray-600">Start typing to find products, categories, or shops</p>
          </div>
        )}
      </div>
    </div>
  );
}