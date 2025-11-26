'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    size: '',
    condition: '',
    material: '',
    stock: '1'
  });
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit to 10 images
    if (images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      // Validate file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    setLoading(true);

    try {
      // Get auth session
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Session expired. Please sign in again.');
        return;
      }

      // Call secure API endpoint with auth token
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          category: formData.category,
          size: formData.size.trim() || null,
          condition: formData.condition || null,
          material: formData.material.trim() || null,
          images: images,
          stock: parseInt(formData.stock) || 1,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create product');
      }

      // Success!
      console.log('✅ Product created:', result.product);
      toast.success('Product created successfully! 🎉');
      setTimeout(() => router.push('/dashboard'), 1000);
      
    } catch (error: any) {
      console.error('❌ Product creation error:', error);
      const errorMsg = error.message || 'Failed to create product. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          Add New Product
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Images (Max 10)</label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {images.length < 10 && (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Images ({images.length}/10)</span>
                  <p className="text-xs text-gray-400 mt-1">Max 5MB per image</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              required
              maxLength={200}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Vintage Denim Jacket"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              maxLength={2000}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              rows={4}
              placeholder="Describe your item..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                max="1000000"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock *</label>
              <input
                type="number"
                required
                min="0"
                max="10000"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Select...</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Dresses">Dresses</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Select...</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Size & Material */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <input
                type="text"
                maxLength={20}
                value={formData.size}
                onChange={e => setFormData({...formData, size: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="S, M, L, XL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Material</label>
              <input
                type="text"
                maxLength={100}
                value={formData.material}
                onChange={e => setFormData({...formData, material: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Cotton, Denim, etc."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-lg uppercase font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}