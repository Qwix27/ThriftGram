'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getPersonalizedFeedRecommendations } from '@/lib/personalized-feed';
import LikeButton from './LikeButton';
import { Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  shops: {
    shop_name: string;
  };
  likes_count: number;
  _recommendationScore?: {
    score: number;
    matchedTags: string[];
    reason: string;
  };
}

export default function PersonalizedFeed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadPersonalizedFeed();
  }, []);

  const loadPersonalizedFeed = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setProducts([]);
        return;
      }

      setIsLoggedIn(true);

      // Get personalized recommendations
      const recommendations = await getPersonalizedFeedRecommendations(user.id, 8);
      setProducts(recommendations);
    } catch (error) {
      console.error('Error loading personalized feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || loading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap size={28} className="text-black" />
            <h2
              className="text-4xl font-bold uppercase tracking-wide"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Personalized For You
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Based on your likes, cart, and purchase history
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group relative"
            >
              {/* Recommendation Badge */}
              {product._recommendationScore && (
                <div className="absolute top-2 left-2 z-20 bg-black text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                  <Zap size={12} />
                  {product._recommendationScore.reason}
                </div>
              )}

              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Like Button - Top Right Corner */}
                  <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <LikeButton productId={product.id} size={18} />
                  </div>

                  {/* Matched Tags Preview */}
                  {product._recommendationScore?.matchedTags && product._recommendationScore.matchedTags.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-wrap gap-1">
                        {product._recommendationScore.matchedTags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-white text-black px-2 py-1 rounded font-semibold">
                            {tag}
                          </span>
                        ))}
                        {product._recommendationScore.matchedTags.length > 3 && (
                          <span className="text-xs bg-white text-black px-2 py-1 rounded font-semibold">
                            +{product._recommendationScore.matchedTags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-1">{product.shops.shop_name}</p>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="font-bold text-sm">₹{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
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
            Explore More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
