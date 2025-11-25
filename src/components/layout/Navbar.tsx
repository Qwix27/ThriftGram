'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { User as UserIcon, Store } from 'lucide-react';
import BecomeSellerModal from '@/components/BecomeSellerModal';

interface UserProfile {
  id: string;
  email: string | undefined;
  isSeller: boolean;
  fullName: string;
  sellerVerified: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showBecomeSellerModal, setShowBecomeSellerModal] = useState(false);

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      loadUser();
    });

    // Also listen for window focus to reload user data
    const handleFocus = () => {
      loadUser();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadUser = async () => {
    const userData = await getCurrentUser();
    if (userData) {
      setUser({
        id: userData.id,
        email: userData.email,
        isSeller: userData.isSeller,
        fullName: userData.fullName,
        sellerVerified: userData.sellerVerified,
      });
    } else {
      setUser(null);
    }
  };

  const handleBecomeSellerClick = async () => {
    // Check fresh user state before opening modal
    await loadUser();
    
    if (user?.isSeller) {
      // Already a seller, go to dashboard
      router.push('/dashboard');
    } else {
      // Not a seller yet, show modal
      setShowBecomeSellerModal(true);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logo1.png" 
                alt="ThriftGram" 
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/shop/all" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                Shop
              </Link>
              <Link href="/collections" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                Collections
              </Link>
              <Link href="/more" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                More
              </Link>
            </div>

            {/* Icons & Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button 
                onClick={() => router.push('/search')}
                className="text-black hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {user ? (
                <>
                  {/* Become Seller / Dashboard */}
                  {!user.isSeller ? (
                    <button
                      onClick={handleBecomeSellerClick}
                      className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-colors hover:bg-gray-800"
                      style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                    >
                      <Store size={16} />
                      Sell
                    </button>
                  ) : (
                    <Link 
                      href="/dashboard" 
                      className="hidden md:flex items-center gap-2 text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" 
                      style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                    >
                      <Store size={16} />
                      Dashboard
                    </Link>
                  )}

                  {/* User Profile */}
                  <Link
                    href="/profile"
                    className="hidden md:flex items-center gap-2 text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors"
                    style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                  >
                    <UserIcon size={16} />
                    Profile
                  </Link>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="hidden md:block text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors"
                    style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link 
                    href="/auth" 
                    className="hidden md:block text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" 
                    style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                  >
                    Login
                  </Link>

                  {/* Sign Up */}
                  <Link
                    href="/auth"
                    className="hidden md:block bg-black text-white px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-colors hover:bg-gray-800"
                    style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative text-black hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden text-black"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link href="/shop/all" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                  Shop
                </Link>
                <Link href="/collections" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                  Collections
                </Link>
                <Link href="/more" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                  More
                </Link>
                
                {user ? (
                  <>
                    {!user.isSeller ? (
                      <button
                        onClick={() => {
                          setShowBecomeSellerModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="text-left bg-black text-white px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide"
                        style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                      >
                        Become a Seller
                      </button>
                    ) : (
                      <Link href="/dashboard" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                        Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-left text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm"
                      style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                      Login
                    </Link>
                    <Link
                      href="/auth"
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide text-center hover:bg-gray-800"
                      style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Become Seller Modal */}
      <BecomeSellerModal 
        isOpen={showBecomeSellerModal}
        onClose={() => setShowBecomeSellerModal(false)}
        onSuccess={() => {
          setShowBecomeSellerModal(false);
          loadUser();
          router.push('/dashboard');
        }}
      />
    </>
  );
}