'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

interface LikeContextType {
  likedProducts: Set<string>;
  toggleLike: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
  isAuthenticated: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUserLikes();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setIsAuthenticated(true);
        loadUserLikes();
      } else {
        setUserId(null);
        setIsAuthenticated(false);
        setLikedProducts(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserId(null);
        setIsAuthenticated(false);
        return;
      }

      setUserId(user.id);
      setIsAuthenticated(true);

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
    if (!userId || !isAuthenticated) {
      // Instead of alert, throw error that component can handle
      throw new Error('AUTH_REQUIRED');
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
      throw error;
    }
  };

  const isLiked = (productId: string) => {
    return likedProducts.has(productId);
  };

  return (
    <LikeContext.Provider value={{ likedProducts, toggleLike, isLiked, isAuthenticated }}>
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