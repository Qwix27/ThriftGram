'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';

interface LikeContextType {
  likedProducts: Set<string>;
  toggleLike: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserLikes();
  }, []);

  const loadUserLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserId(null);
        return;
      }

      setUserId(user.id);

      // Get user's liked products
      const { data: likes } = await supabase
        .from('product_likes')
        .select('product_id')
        .eq('user_id', user.id);

      if (likes) {
        setLikedProducts(new Set(likes.map(like => like.product_id)));
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const toggleLike = async (productId: string) => {
    if (!userId) {
      alert('Please login to like products');
      return;
    }

    const isCurrentlyLiked = likedProducts.has(productId);

    try {
      if (isCurrentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('product_likes')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (error) throw error;

        // Decrement likes count
        await supabase.rpc('decrement_likes', { product_id: productId });

        // Update local state
        setLikedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Like
        const { error } = await supabase
          .from('product_likes')
          .insert({
            user_id: userId,
            product_id: productId,
          });

        if (error) throw error;

        // Increment likes count
        await supabase.rpc('increment_likes', { product_id: productId });

        // Update local state
        setLikedProducts(prev => new Set(prev).add(productId));
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    }
  };

  const isLiked = (productId: string) => {
    return likedProducts.has(productId);
  };

  return (
    <LikeContext.Provider value={{ likedProducts, toggleLike, isLiked }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikeProvider');
  }
  return context;
}