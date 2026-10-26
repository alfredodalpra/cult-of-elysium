import type { Metadata } from 'next'
import { marcellus, outfit } from '@/lib/fonts'
import { CartProvider } from '@/components/cart/cart-provider'
import './globals.css'

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time; share-image URLs need an absolute base.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Cult of Elysium',
    template: '%s · Cult of Elysium',
  },
  description: 'Sacred jewelry from the goddess of night: gothic, celestial pieces forged with intention.',
  openGraph: {
    siteName: 'Cult of Elysium',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
