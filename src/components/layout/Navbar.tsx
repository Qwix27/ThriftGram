'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50" style={{minHeight: '64px', backgroundColor: '#ffffff'}}>
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

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Replace existing search button */}
<button 
  onClick={() => router.push('/search')}
  className="text-black hover:text-gray-600 transition-colors"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</button>

            {/* Auth Buttons - Only show on desktop */}
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="hidden md:block text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" 
                  style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                >
                  Dashboard
                </Link>
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
                <Link 
                  href="/auth" 
                  className="hidden md:block text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm transition-colors" 
                  style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="hidden md:block bg-black text-white px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-gray-800"
                  style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}
                >
                  Sign Up
                </Link>
              </>
            )}

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
              
              {/* Mobile Auth Links */}
              {user ? (
                <>
                  <Link href="/dashboard" className="text-black hover:text-gray-600 font-medium uppercase tracking-wide text-sm" style={{fontFamily: 'Space Grotesk, Arial, sans-serif'}}>
                    Dashboard
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
                    className="bg-black text-white px-4 py-2 text-sm font-medium uppercase tracking-wide text-center hover:bg-gray-800"
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
  );
}