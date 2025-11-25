'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/lib/ReviewContext';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
}

export default function ReviewList({ reviews, averageRating }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Average Rating */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{averageRating}</span>
            <span className="text-gray-600">/5</span>
          </div>
          <div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= Math.round(averageRating) ? '#000' : '#ddd'}
                  color={star <= Math.round(averageRating) ? '#000' : '#ddd'}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= review.rating ? '#000' : '#ddd'}
                        color={star <= review.rating ? '#000' : '#ddd'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>

            {/* Comment */}
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
