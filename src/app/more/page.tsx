import React from 'react';
import Link from 'next/link';

export default function MorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold uppercase tracking-wide mb-6" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            About ThriftGram
          </h1>
          <p className="text-xl opacity-90">
            Sustainable fashion through curated vintage and thrift pieces
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold uppercase tracking-wide mb-6" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Our Story
          </h2>
          <p className="text-gray-700 mb-6">
            ThriftGram started with a simple idea: thrifting should be fun, safe, and easy.
            We saw how slow DMs, scams, and scattered pages made shopping harder than it needed to be,
            so we built a platform that brings everything together. Verified sellers, secure payments,
            and curated discovery come together to give you a smooth, trustworthy way to find unique pieces you’ll actually love.
          </p>
          
          <h2 className="text-3xl font-bold uppercase tracking-wide mb-6 mt-12" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            What We Do
          </h2>
          <p className="text-gray-700 mb-6">
            We bring together Instagram thrift stores and independent sellers on one trusted platform.
            Every item is curated for quality and style,
            and our system makes it simple to browse, compare, and shop unique pieces without the usual DM delays or payment risks.
          </p>

          <h2 className="text-3xl font-bold uppercase tracking-wide mb-6 mt-12" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Join Our Community
          </h2>
          <p className="text-gray-700 mb-6">
            Whether you’re hunting for standout thrift finds or looking to grow as a seller, ThriftGram gives you a safe and supportive space.
            Be part of a growing community that values creativity, sustainability, and smoother thrift shopping.
          </p>

          <div className="flex gap-4 mt-12">
            <Link href="/shop/all" className="bg-black text-white px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              Start Shopping
            </Link>
            <Link href="/contact" className="border-2 border-black text-black px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-black hover:text-white transition-colors" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}