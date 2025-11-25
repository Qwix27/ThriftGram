'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Store, Instagram, FileText, AlertCircle } from 'lucide-react';
import { becomeSeller } from '@/lib/auth';

interface BecomeSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BecomeSellerModal({ isOpen, onClose, onSuccess }: BecomeSellerModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: '',
    instagramHandle: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate
      if (!formData.shopName.trim()) {
        setError('Shop name is required');
        setLoading(false);
        return;
      }

      if (!formData.instagramHandle.trim()) {
        setError('Instagram handle is required');
        setLoading(false);
        return;
      }

      // Add @ if not present
      let handle = formData.instagramHandle.trim();
      if (!handle.startsWith('@')) {
        handle = '@' + handle;
      }

      const result = await becomeSeller({
        shopName: formData.shopName.trim(),
        instagramHandle: handle,
        bio: formData.bio.trim() || undefined,
      });

      console.log('Become seller result:', result);

      // Success! Call the success callback
      onClose();
      
      // Clear form
      setFormData({ shopName: '', instagramHandle: '', bio: '' });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Become seller error:', err);
      
      // Check if already a seller
      if (err.message?.includes('already a seller')) {
        setError('You are already a seller! Redirecting to dashboard...');
        setTimeout(() => {
          onClose();
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(err.message || 'Failed to create seller account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Become a Seller
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Start selling your thrift finds! Create your shop and reach thousands of buyers.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Shop Name *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Vintage Finds Co."
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}
                />
              </div>
            </div>

            {/* Instagram Handle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Instagram Handle *
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="instagramHandle"
                  value={formData.instagramHandle}
                  onChange={handleChange}
                  placeholder="@vintagefinds or vintagefinds"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your Instagram handle helps buyers find your original posts
              </p>
            </div>

            {/* Bio (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Shop Bio (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell buyers about your shop and style..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Seller Benefits:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Reach thousands of buyers</li>
                <li>✓ Secure payment processing</li>
                <li>✓ Professional storefront</li>
                <li>✓ Analytics and insights</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl uppercase tracking-wide"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              {loading ? 'Creating Shop...' : 'Create Seller Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}