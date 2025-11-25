'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, signInWithGoogle } from '@/lib/auth';
import { Mail, Lock, User, Instagram, ShoppingBag } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    instagramHandle: '',
    shopName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        router.push('/');
      } else {
        await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          userType: userType as 'customer' | 'shop_owner',
          shopName: formData.shopName,
          instagramHandle: formData.instagramHandle,
        });
        router.push(userType === 'shop_owner' ? '/dashboard' : '/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
            THRIFTGRAM
          </h1>
          <p className="text-gray-600">Discover Instagram Thrift Shops</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Toggle Login/Signup */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
            >
              Sign Up
            </button>
          </div>

          {/* User Type Selection (Only for Signup) */}
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === 'customer'
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ShoppingBag className={`mx-auto mb-2 ${
                    userType === 'customer' ? 'text-black' : 'text-gray-400'
                  }`} size={24} />
                  <div className="text-sm font-medium text-gray-900" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>Browse & Buy</div>
                  <div className="text-xs text-gray-500 mt-1">Customer</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('shop_owner')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === 'shop_owner'
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Instagram className={`mx-auto mb-2 ${
                    userType === 'shop_owner' ? 'text-black' : 'text-gray-400'
                  }`} size={24} />
                  <div className="text-sm font-medium text-gray-900" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>Sell Products</div>
                  <div className="text-xs text-gray-500 mt-1">Shop Owner</div>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                  />
                </div>
              </div>
            )}

            {/* Shop Details (Shop Owner Signup only) */}
            {!isLogin && userType === 'shop_owner' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                    Shop Name
                  </label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="Vintage Finds Co."
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="instagramHandle"
                      value={formData.instagramHandle}
                      onChange={handleChange}
                      placeholder="@vintagefinds"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                />
              </div>
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-black hover:text-gray-600"
                  style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl uppercase tracking-wide"
              style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Social Login Option */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}