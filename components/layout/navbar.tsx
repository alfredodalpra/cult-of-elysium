'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useCart } from '@/components/cart/cart-provider'
import { ShopDropdown, type NavLink } from './shop-dropdown'

const linkClass = 'text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors'
const buttonClass = `${linkClass} cursor-pointer bg-transparent border-none font-body`

export function Navbar({ collections }: { collections: { handle: string; title: string }[] }) {
  const { cart, open } = useCart()
  const [shopOpen, setShopOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeShop = useCallback(() => setShopOpen(false), [])
  const closeMenu = () => setMenuOpen(false)

  const shopLinks: NavLink[] = [
    { name: 'All Products', href: '/store' },
    ...collections.map(c => ({ name: c.title, href: `/collections/${c.handle}` })),
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-void/90 backdrop-blur-xl border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto relative flex items-center justify-between px-6 py-4">
        {/* Logo — left */}
        <Link href="/store" className="relative h-10 w-40 md:h-12 md:w-56 shrink-0">
          <Image
            src="/logo.webp"
            alt="Cult of Elysium"
            fill
            className="object-contain object-left opacity-80"
            sizes="240px"
            priority
          />
        </Link>

        {/* Nav links — absolutely centered, desktop only */}
        <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 list-none">
          <li className="relative">
            <button
              data-shop-toggle
              onClick={() => setShopOpen(!shopOpen)}
              aria-expanded={shopOpen}
              className={buttonClass}
            >
              Shop
            </button>
            {shopOpen && <ShopDropdown links={shopLinks} onClose={closeShop} />}
          </li>
          <li><Link href="/collections" className={linkClass}>Collections</Link></li>
          <li><Link href="/about" className={linkClass}>About</Link></li>
        </ul>

        {/* Cart — right, plus the menu toggle on mobile */}
        <div className="flex items-center gap-5 shrink-0">
          <button onClick={open} className={`${buttonClass} py-2`}>
            Cart ({cart?.totalQuantity ?? 0})
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`${buttonClass} md:hidden py-2`}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/[0.06] px-6 pb-6 pt-2">
          <p className="text-[10px] tracking-[3px] uppercase text-ritual-violet mt-4 mb-1">Shop</p>
          {shopLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={closeMenu} className={`block py-3 ${linkClass}`}>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-white/[0.06] mt-3 pt-3">
            <Link href="/collections" onClick={closeMenu} className={`block py-3 ${linkClass}`}>Collections</Link>
            <Link href="/about" onClick={closeMenu} className={`block py-3 ${linkClass}`}>About</Link>
          </div>
        </div>
      )}
    </header>
  )
}
