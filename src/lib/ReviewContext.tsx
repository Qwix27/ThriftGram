'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string) => Promise<void>;
  getProductReviews: (productId: string) => Promise<Review[]>;
  averageRating: (productId: string) => number;
  loading: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const getProductReviews = async (productId: string): Promise<Review[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const fetchedReviews = data || [];
      setReviews(fetchedReviews);
      return fetchedReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: Math.min(5, Math.max(1, rating)), // Clamp 1-5
          comment: comment.trim(),
        });

      if (error) throw error;

      // Refresh reviews after adding
      await getProductReviews(productId);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const averageRating = (productId: string): number => {
    const productReviews = reviews.filter(r => r.product_id === productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, averageRating, loading }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider');
  }
  return context;
}
