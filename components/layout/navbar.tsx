'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/cart/cart-provider'
import { ShopDropdown } from './shop-dropdown'

export function Navbar() {
  const { cart, open } = useCart()
  const [shopOpen, setShopOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-void/90 backdrop-blur-xl border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/store" className="font-display text-base tracking-[5px] uppercase text-bone">
          Cult of Elysium
        </Link>
        <ul className="flex gap-10 list-none">
          <li className="relative">
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors cursor-pointer bg-transparent border-none font-body"
            >
              Shop
            </button>
            {shopOpen && <ShopDropdown onClose={() => setShopOpen(false)} />}
          </li>
          <li>
            <Link href="/collections" className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors">
              Collections
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors">
              About
            </Link>
          </li>
        </ul>
        <button onClick={open} className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors cursor-pointer bg-transparent border-none font-body">
          Cart ({cart?.totalQuantity ?? 0})
        </button>
      </nav>
    </header>
  )
}
