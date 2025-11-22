'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">Add some items to get started!</p>
          <Link href="/shop/all" className="bg-black text-white px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors inline-block" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold uppercase tracking-wide mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Shopping Cart
          </h1>
          <p className="text-lg opacity-90">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 border-b border-gray-200 pb-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-medium uppercase tracking-wide mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                      {item.name}
                    </h3>
                    <p className="text-2xl font-semibold mb-4">₹{item.price}.00</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium uppercase text-sm tracking-wide"
                        style={{fontFamily: 'Space Grotesk, sans-serif'}}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={clearCart}
              className="mt-8 text-gray-600 hover:text-black font-medium uppercase text-sm tracking-wide"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-6" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-4 flex justify-between text-xl">
                  <span className="font-bold uppercase tracking-wide" style={{fontFamily: 'Space Grotesk, sans-serif'}}>Total</span>
                  <span className="font-bold">${(cartTotal * 1.1).toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full bg-black text-white py-4 px-6 text-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Checkout
              </button>
              
              <Link href="/shop/all" className="block text-center text-gray-600 hover:text-black font-medium uppercase text-sm tracking-wide" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}