import type { Metadata } from 'next'
import { marcellus, outfit } from '@/lib/fonts'
import { CartProvider } from '@/components/cart/cart-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cult of Elysium',
  description: 'Sacred jewelry from the goddess of night',
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
