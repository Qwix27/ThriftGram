'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getRecommendedProducts, getTrendingProducts } from '@/lib/recommendations';
import LikeButton from './LikeButton';
import { motion } from 'framer-motion';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  shops: {
    shop_name: string;
  };
}

export default function RecommendedProducts() {
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let recommendedProducts: RecommendedProduct[] = [];

      if (user) {
        // Get personalized recommendations for logged-in users
        recommendedProducts = await getRecommendedProducts(user.id, 6);
      }

      // If no personalized recommendations or user not logged in, get trending
      if (recommendedProducts.length === 0) {
        recommendedProducts = await getTrendingProducts(6);
      }

      setProducts(recommendedProducts);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold uppercase tracking-wide mb-12"
          style={{fontFamily: 'Space Grotesk, sans-serif'}}
        >
          You Might Like
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="group">
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Like Button - Top Right Corner */}
                  <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <LikeButton productId={product.id} size={16} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-1">{product.shops.shop_name}</p>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="font-bold text-sm">₹{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop/all"
            className="inline-block border-2 border-black px-8 py-3 font-semibold uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
