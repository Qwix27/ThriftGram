'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Instagram } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import LikeButton from '../../../components/LikeButton';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  size: string;
  condition: string;
  material: string;
  stock: number;
  likes_count: number;
  shops: {
    id: string;
    shop_name: string;
    instagram_handle: string;
  };
}

interface SuggestedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  shops: {
    shop_name: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  // Add this new useEffect AFTER the loadProduct useEffect
useEffect(() => {
  if (product && !loading) {
    // Track recently viewed
    const recentKey = 'thriftgram_recent_products';
    const recent = JSON.parse(localStorage.getItem(recentKey) || '[]');
    
    const productData = {
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      shop_name: product.shops.shop_name,
      viewedAt: new Date().toISOString()
    };
    
    // Remove if already exists (to update position)
    const filtered = recent.filter((p: any) => p.id !== product.id);
    
    // Add to beginning and keep only last 10
    const updated = [productData, ...filtered].slice(0, 10);
    
    localStorage.setItem(recentKey, JSON.stringify(updated));
  }
}, [product, loading]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, shops(id, shop_name, instagram_handle)')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProduct(data);

      // Load suggested products from same category
      if (data) {
        const { data: suggested } = await supabase
          .from('products')
          .select('*, shops(shop_name)')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(4);

        setSuggestedProducts(suggested || []);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    toast.success('Added to cart! 🛒');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link href="/shop/all" className="text-black underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === i ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <Link
              href={`/shop/${product.shops.id}`}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
            >
              <Instagram size={16} />
              {product.shops.shop_name}
            </Link>

            <h1 className="text-4xl font-bold mb-4 uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              {product.name}
            </h1>

            {/* Price and Like Button Row */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-3xl font-bold">₹{product.price}</p>
              <LikeButton productId={product.id} size={32} showCount={true} likesCount={product.likes_count} />
            </div>

            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            <div className="space-y-3 mb-8 text-sm">
              {product.category && (
                <div className="flex gap-2">
                  <span className="font-medium">Category:</span>
                  <span>{product.category}</span>
                </div>
              )}
              {product.size && (
                <div className="flex gap-2">
                  <span className="font-medium">Size:</span>
                  <span>{product.size}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex gap-2">
                  <span className="font-medium">Condition:</span>
                  <span>{product.condition}</span>
                </div>
              )}
              {product.material && (
                <div className="flex gap-2">
                  <span className="font-medium">Material:</span>
                  <span>{product.material}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="font-medium">Stock:</span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-black text-white py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-medium"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* You Might Also Like */}
        {suggestedProducts.length > 0 && (
          <section className="mt-20 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold mb-8 uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {suggestedProducts.map(product => (
                <Link key={product.id} href={`/product/${product.id}`} className="group">
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md">
                      <LikeButton productId={product.id} size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{product.shops.shop_name}</p>
                    <h3 className="font-medium mb-1 line-clamp-2 text-sm">{product.name}</h3>
                    <p className="font-bold">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}