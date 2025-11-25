'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Package, Heart, User, Store, ShoppingBag } from 'lucide-react';
import BecomeSellerModal from '@/components/BecomeSellerModal';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBecomeSellerModal, setShowBecomeSellerModal] = useState(false);

  useEffect(() => {
    loadUserData();

    // Reload when window gains focus
    const handleFocus = () => {
      loadUserData();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadUserData = async () => {
    try {
      console.log('🔍 Profile: Loading user data...');
      
      // Force fresh data from database
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.log('❌ Profile: No auth user, redirecting to /auth');
        router.push('/auth');
        return;
      }

      // Get FRESH profile data directly from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!profile) {
        console.error('❌ Profile: Profile not found');
        router.push('/auth');
        return;
      }

      console.log('✅ Profile: Loaded profile:', {
        email: profile.email,
        is_seller: profile.is_seller
      });

      setUser({
        id: profile.id,
        email: profile.email || authUser.email,
        fullName: profile.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        isSeller: profile.is_seller || false,
        sellerVerified: profile.seller_verified || false,
        avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url || null,
      });
    } catch (error) {
      console.error('❌ Profile: Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeSellerClick = () => {
    console.log('🏪 Profile: Become seller clicked');
    setShowBecomeSellerModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold uppercase" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                    {user.fullName}
                  </h1>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                  {user.isSeller && (
                    <div className="flex items-center gap-2 mt-2">
                      <Store size={16} className="text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Seller Account</span>
                      {user.sellerVerified && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Verified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {user.isSeller && (
                <Link
                  href="/dashboard"
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                  <Store size={20} />
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="text-blue-600" size={24} />
                <h3 className="text-gray-600 text-sm font-medium uppercase">Total Orders</h3>
              </div>
              <p className="text-4xl font-bold">0</p>
              <p className="text-xs text-gray-500 mt-2">Coming soon</p>
            </div>

            <Link href="/liked" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="text-red-500 fill-red-500" size={24} />
                <h3 className="text-gray-600 text-sm font-medium uppercase">Liked Products</h3>
              </div>
              <p className="text-4xl font-bold">♥</p>
              <p className="text-xs text-gray-500 mt-2">View all liked items</p>
            </Link>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="text-green-600" size={24} />
                <h3 className="text-gray-600 text-sm font-medium uppercase">Account Status</h3>
              </div>
              <p className="text-lg font-bold mt-2">
                {user.isSeller ? 'Buyer & Seller' : 'Buyer'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active member</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold uppercase mb-6" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg">{user.fullName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Account Type</label>
                <p className="text-lg">{user.isSeller ? 'Buyer & Seller' : 'Buyer Only'}</p>
              </div>

              {!user.isSeller && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Want to sell your thrift items? Upgrade your account to start selling!
                  </p>
                  <button
                    onClick={handleBecomeSellerClick}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 uppercase text-sm font-medium"
                    style={{fontFamily: 'Space Grotesk, sans-serif'}}
                  >
                    Become a Seller
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/liked"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex items-center justify-between group"
            >
              <div>
                <h3 className="text-xl font-bold mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                  Liked Products
                </h3>
                <p className="text-gray-600">View your saved items</p>
              </div>
              <Heart className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
            </Link>

            <Link
              href="/shop/all"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex items-center justify-between group"
            >
              <div>
                <h3 className="text-xl font-bold mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                  Browse Products
                </h3>
                <p className="text-gray-600">Discover unique thrift finds</p>
              </div>
              <ShoppingBag className="text-blue-600 group-hover:scale-110 transition-transform" size={32} />
            </Link>
          </div>
        </div>
      </div>

      {/* Become Seller Modal */}
      <BecomeSellerModal 
        isOpen={showBecomeSellerModal}
        onClose={() => setShowBecomeSellerModal(false)}
        onSuccess={async () => {
          console.log('✅ Profile: Seller account created');
          setShowBecomeSellerModal(false);
          // Reload user data to update UI
          await loadUserData();
          // Redirect to dashboard
          router.push('/dashboard');
        }}
      />
    </>
  );
}