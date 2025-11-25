'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useLikes } from '@/lib/LikeContext';

interface LikeButtonProps {
  productId: string;
  size?: number;
  showCount?: boolean;
  likesCount?: number;
}

export default function LikeButton({ 
  productId, 
  size = 24, 
  showCount = false, 
  likesCount = 0 
}: LikeButtonProps) {
  const router = useRouter();
  const { isLiked, toggleLike, isAuthenticated } = useLikes();
  const liked = isLiked(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await toggleLike(productId);
    } catch (error: any) {
      if (error.message === 'AUTH_REQUIRED') {
        // Redirect to auth page
        router.push('/auth');
      } else {
        // Show error toast or notification
        console.error('Failed to toggle like:', error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 group transition-transform hover:scale-110"
      type="button"
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <Heart
        size={size}
        className={`transition-all ${
          liked
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 group-hover:text-red-500'
        }`}
      />
      {showCount && likesCount > 0 && (
        <span className="text-sm font-medium text-gray-700">
          {likesCount}
        </span>
      )}
    </button>
  );
}