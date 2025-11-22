import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsPage() {
  const collections = [
    {
      id: 1,
      name: 'Winter Collection 2025',
      description: 'Cozy vintage pieces perfect for the cold season',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
      itemCount: 24
    },
    {
      id: 2,
      name: 'Street Style Essentials',
      description: 'Urban vintage wear for the modern wardrobe',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
      itemCount: 18
    },
    {
      id: 3,
      name: 'Denim Archive',
      description: 'Classic denim pieces from different eras',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop',
      itemCount: 32
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold uppercase tracking-wide mb-6" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Collections
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Curated selections of vintage pieces, organized by theme, season, and style
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link href={`/collections/${collection.id}`} key={collection.id} className="group cursor-pointer">
              <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
                <Image 
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold uppercase tracking-wide mb-2" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                    {collection.name}
                  </h2>
                  <p className="text-sm opacity-90">{collection.itemCount} items</p>
                </div>
              </div>
              <p className="text-gray-600">{collection.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold uppercase tracking-wide mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            New Collections Every Month
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to get notified when new curated collections drop
          </p>
          <button className="bg-black text-white px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}