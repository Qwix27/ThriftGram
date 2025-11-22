'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Shop {
  id: string;
  shop_name: string;
  instagram_handle: string;
  bio: string | null;
  profile_image: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  likes_count: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profile?.user_type !== 'shop_owner') {
        router.push('/');
        return;
      }

      const { data: shopData } = await supabase
        .from('shops')
        .select('id, shop_name, instagram_handle, bio, profile_image')
        .eq('owner_id', user.id)
        .single();

      if (!shopData) {
        router.push('/');
        return;
      }

      setShop(shopData);

      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, price, images, category, stock, likes_count')
        .eq('shop_id', shopData.id)
        .order('created_at', { ascending: false });

      setProducts(productsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await supabase.from('products').delete().eq('id', productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  // Skeleton Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-6 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-10 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop not found</h1>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg">Go Home</Link>
        </div>
      </div>
    );
  }

  const totalLikes = products.reduce((sum, p) => sum + p.likes_count, 0);
  const inStock = products.filter(p => p.stock > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {shop.profile_image ? (
                <img src={shop.profile_image} alt={shop.shop_name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <Package size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                  {shop.shop_name}
                </h1>
                <p className="text-gray-600 mt-1">{shop.instagram_handle}</p>
              </div>
            </div>
            <Link
              href="/dashboard/add-product"
              className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800"
            >
              <Plus size={20} />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium uppercase">Total Products</h3>
            <p className="text-4xl font-bold mt-2">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium uppercase">Total Likes</h3>
            <p className="text-4xl font-bold mt-2">{totalLikes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium uppercase">In Stock</h3>
            <p className="text-4xl font-bold mt-2">{inStock}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-bold uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              Your Products
            </h2>
          </div>
          
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first product!</p>
              <Link href="/dashboard/add-product" className="bg-black text-white px-6 py-3 rounded-lg inline-flex items-center gap-2">
                <Plus size={20} />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                          <span className="ml-4 font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.likes_count}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/dashboard/edit-product/${product.id}`} className="text-black hover:text-gray-600">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}