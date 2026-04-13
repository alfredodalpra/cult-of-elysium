'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const categories = [
  { name: 'All Products', href: '/store' },
  { name: 'Necklaces', href: '/collections/necklaces' },
  { name: 'Bracelets', href: '/collections/bracelets' },
  { name: 'Earrings', href: '/collections/earrings' },
  { name: 'Offerings', href: '/collections/offerings' },
]

export function ShopDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div ref={ref} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-deep-altar border border-white/[0.06] rounded-lg p-4 min-w-[180px]">
      {categories.map((cat) => (
        <Link
          key={cat.href}
          href={cat.href}
          onClick={onClose}
          className="block py-2 px-3 text-[11px] tracking-[2px] uppercase text-muted hover:text-bone transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
