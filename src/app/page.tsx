'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LikeButton from '@/components/LikeButton';
import PersonalizedFeed from '@/components/PersonalizedFeed';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  shops: {
    shop_name: string;
  };
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, shops(shop_name)')
      .order('created_at', { ascending: false })
      .limit(8);

    setFeaturedProducts(data || []);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/hero-image.jpeg"
          alt="Hero Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20"
        >
          <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.5 }}
  className="mb-8"
>
  <img
    src="/logo3.png"
    alt="THRIFTGRAM"
    className="mx-auto w-full max-w-4xl px-4 drop-shadow-2xl"
    style={{ height: 'auto', filter: 'drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.8))' }}
  />
</motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-2xl mb-12 tracking-wide"
          >
            Discover Unique Instagram Thrift Finds
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link
              href="/shop/all"
              className="relative inline-flex items-center gap-2 bg-white text-black px-12 py-4 text-lg font-bold uppercase overflow-hidden group transition-all duration-500 border-2 border-white"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              <span className="absolute inset-0 bg-black scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Shop Now</span>
              <svg
                className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:stroke-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Shop by Gender */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/shop/all?gender=men" className="relative h-[700px] overflow-hidden group block">
              <img
                src="men-category.jpeg"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500"></div>
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="relative inline-flex items-center gap-3 bg-white text-black px-16 py-4 text-xl font-bold uppercase overflow-hidden border-2 border-white" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                  <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">MENS</span>
                  <svg
                    className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:stroke-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/shop/all?gender=women" className="relative h-[700px] overflow-hidden group block">
              <img
                src="women-category1.jpeg"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500"></div>
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="relative inline-flex items-center gap-3 bg-white text-black px-16 py-4 text-xl font-bold uppercase overflow-hidden border-2 border-white" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                  <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">WOMENS</span>
                  <svg
                    className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:stroke-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Announcement Bar */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gray-100 py-4"
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm uppercase tracking-wide font-medium">WINTER COLLECTION 3 OUT NOW.</p>
          <Link href="/collections" className="text-sm uppercase tracking-wide font-medium hover:underline">
            BROWSE RELEASE →
          </Link>
        </div>
      </motion.section>

      {/* Welcome Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 text-center bg-white"
      >
        <p className="text-sm uppercase tracking-wide text-gray-600 mb-2">WELCOME TO THRIFTGRAM.</p>
        <h2 className="text-3xl font-bold uppercase tracking-wide" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          EXPLORE THE CATALOG.
        </h2>
      </motion.section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12 text-center uppercase" 
          style={{fontFamily: 'Space Grotesk, sans-serif'}}
        >
          Featured Products
        </motion.h2>
        
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available. Add products from dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/product/${product.id}`} className="group block">
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
              </motion.div>
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop/all"
            className="relative inline-flex items-center gap-2 bg-black text-white px-12 py-4 text-lg font-bold uppercase overflow-hidden group transition-all duration-500 border-2 border-black"
            style={{fontFamily: 'Space Grotesk, sans-serif'}}
          >
            <span className="absolute inset-0 bg-white scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center"></span>
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">View All Products</span>
            <svg
              className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:stroke-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* Personalized Feed - NEW FEATURE */}
      <PersonalizedFeed />

      {/* Shop by Category */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-12 text-center uppercase" 
            style={{fontFamily: 'Space Grotesk, sans-serif'}}
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Tops', url: '/collections/tops', img: 'tops4.jpeg' },
              { name: 'Bottoms', url: '/collections/bottoms', img: 'bottoms1.jpg' },
              { name: 'Outerwear', url: '/collections/outerwear', img: 'outerwear2.jpg' },
              { name: 'Accessories', url: '/collections/accessories', img: 'accessories1.jpeg' }
            ].map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={cat.url} className="relative aspect-square rounded-lg overflow-hidden group block">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
                    <h3 className="text-white text-2xl font-bold uppercase group-hover:scale-110 transition-transform duration-300">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}