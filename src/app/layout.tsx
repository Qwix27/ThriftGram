import React from 'react'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/CartContext'
import { LikeProvider } from '@/lib/LikeContext'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ThriftGram - Discover Instagram Thrift Shops',
  description: 'Discover unique vintage and thrift pieces from Instagram thrift shops. Curated second-hand fashion for men and women. Sustainable style with character.',
  keywords: ['thrift', 'vintage', 'second-hand', 'fashion', 'sustainable', 'clothing', 'marketplace', 'instagram', 'thrift shops'],
  authors: [{ name: 'ThriftGram' }],
  creator: 'ThriftGram',
  publisher: 'ThriftGram',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thriftgram.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo4(2).png',
  },
  openGraph: {
    title: 'ThriftGram - Discover Instagram Thrift Shops',
    description: 'Discover unique vintage and thrift pieces from Instagram thrift shops. Curated second-hand fashion for men and women. Sustainable style with character.',
    url: 'https://thriftgram.vercel.app',
    siteName: 'ThriftGram',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ThriftGram - Discover Instagram Thrift Shops',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThriftGram - Discover Instagram Thrift Shops',
    description: 'Discover unique vintage and thrift pieces from Instagram thrift shops. Curated second-hand fashion for men and women. Sustainable style with character.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className={spaceGrotesk.className}>
        <CartProvider>
          <LikeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LikeProvider>
        </CartProvider>
      </body>
    </html>
  )
}