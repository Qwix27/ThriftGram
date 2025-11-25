'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useReviews } from '@/lib/ReviewContext';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  productId: string;
  onReviewAdded?: () => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const { addReview } = useReviews();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await addReview(productId, rating, comment);
      setSuccess(true);
      setRating(0);
      setComment('');
      
      if (onReviewAdded) {
        onReviewAdded();
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      if (err.message.includes('not authenticated')) {
        router.push('/auth');
      } else {
        setError(err.message || 'Failed to submit review');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                fill={star <= rating ? '#000' : 'none'}
                color={star <= rating ? '#000' : '#ccc'}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">{rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}</p>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
          Review posted successfully!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
