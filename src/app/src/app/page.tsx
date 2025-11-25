import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] max-h-[700px] bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: "url('https://framerusercontent.com/images/oXYbKU56HOozBtjnD82CrK6IajM.jpg')"}}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Hero Text */}
        <div className="absolute top-6 right-6 w-[919px] h-[326px] flex flex-col justify-center items-end">
          <div className="w-full h-[265px] flex justify-end items-center">
            <h1 className="text-[327px] font-bold leading-none text-right" 
                style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              GARM
            </h1>
          </div>
          <div className="flex items-center gap-2.5 pr-5">
            <Link href="/shop/all" className="text-[91px] font-bold leading-none text-right hover:opacity-80 transition-opacity"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Splash Image */}
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
             style={{backgroundImage: "url('https://framerusercontent.com/images/YnF9VzxiP3UJbdj850LUBoXtw.png')"}}>
        </div>
      </section>

      {/* Collection Browse Banner */}
      <section className="w-full h-fit bg-white">
        {/* This would be a component instance - placeholder for now */}
        <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
          <span className="text-lg font-medium uppercase">Collection Browse</span>
        </div>
      </section>

      {/* Welcome Banner */}
      <section className="w-full h-[100px] bg-white flex flex-col items-center justify-center gap-1">
        <h2 className="text-xl font-medium uppercase tracking-wide" 
            style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          WELCOME To ThriftGram.
        </h2>
        <h3 className="text-2xl font-semibold uppercase tracking-wide" 
            style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          explore the catalog.
        </h3>
      </section>

      {/* Category Links Container */}
      <section className="w-full h-fit bg-black flex gap-px">
        {/* Mens Category */}
        <div className="flex-1 h-[800px] bg-cover bg-center bg-no-repeat relative group cursor-pointer"
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop')"}}>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-4xl font-bold uppercase tracking-wider" 
                style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              MENS
            </h3>
          </div>
        </div>

        {/* Womens Category */}
        <div className="flex-1 h-[800px] bg-cover bg-center bg-no-repeat relative group cursor-pointer"
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop')"}}>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-4xl font-bold uppercase tracking-wider" 
                style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              WOMENS
            </h3>
          </div>
        </div>
      </section>

      {/* Collections Photo Text Banner */}
      <section className="w-full h-[50px] bg-white rounded-none px-15 py-2.5 flex justify-between items-center">
        <span className="text-xl font-medium uppercase tracking-wide" 
              style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          COLLECTIONS PHOTOSHOOT
        </span>
        <Link href="/collections/winter-2025" 
              className="text-xl font-medium uppercase tracking-wide hover:opacity-80 transition-opacity"
              style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          WINTER COLLECTION 3
        </Link>
      </section>

      {/* Collections Photo Container */}
      <section className="w-full h-fit flex justify-center gap-2.5">
        <div className="w-[90%] h-[453px] max-h-[756px] aspect-[2.645] bg-gray-100 rounded-none overflow-hidden">
          {/* Slideshow placeholder */}
          <div className="w-full h-full flex">
            <div className="w-full h-full bg-cover bg-center bg-no-repeat"
                 style={{backgroundImage: "url('https://framerusercontent.com/images/xv6BAHKq2LMxud1NckFQTiRg3Jc.png')"}}>
            </div>
            <div className="w-full h-full bg-cover bg-center bg-no-repeat"
                 style={{backgroundImage: "url('https://framerusercontent.com/images/xNcqMJIpIUsPbi2EgICOmPff1gs.png')"}}>
            </div>
            <div className="w-full h-full bg-cover bg-center bg-no-repeat"
                 style={{backgroundImage: "url('https://framerusercontent.com/images/RFUtFPubfH0QwDUIQ37VxXdM7M.png')"}}>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="w-full py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 uppercase tracking-wide" 
              style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Product Card 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop" 
                  alt="Vintage Denim Jacket"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-wide mb-2" 
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Vintage Denim Jacket
              </h3>
              <p className="text-gray-600 mb-2">Classic blue denim with authentic wear</p>
              <p className="text-xl font-semibold">$45.00</p>
            </div>

            {/* Product Card 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop" 
                  alt="Retro Sweater"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-wide mb-2" 
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Retro Sweater
              </h3>
              <p className="text-gray-600 mb-2">Cozy knit with vintage pattern</p>
              <p className="text-xl font-semibold">$35.00</p>
            </div>

            {/* Product Card 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop" 
                  alt="Classic T-Shirt"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-wide mb-2" 
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Classic T-Shirt
              </h3>
              <p className="text-gray-600 mb-2">Soft cotton with vintage logo</p>
              <p className="text-xl font-semibold">$25.00</p>
            </div>

            {/* Product Card 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image 
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop" 
                  alt="Vintage Jeans"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium uppercase tracking-wide mb-2" 
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Vintage Jeans
              </h3>
              <p className="text-gray-600 mb-2">High-waisted with authentic fade</p>
              <p className="text-xl font-semibold">$55.00</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/shop/all" 
                  className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-5xl font-bold mb-6 uppercase tracking-wide" 
              style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Discover Unique Finds
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Curated vintage and thrift pieces that tell a story. Each item is carefully selected for quality, style, and character.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/all" 
                  className="bg-white text-black px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-gray-100 transition-colors"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              Shop Now
            </Link>
            <Link href="/collections" 
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}>
              Browse Collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}