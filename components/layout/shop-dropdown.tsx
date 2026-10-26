'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export type NavLink = { name: string; href: string }

export function ShopDropdown({ links, onClose }: { links: NavLink[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Ignore clicks on the toggle button itself, so it can close the menu.
      const target = e.target as HTMLElement
      if (ref.current && !ref.current.contains(target) && !target.closest('[data-shop-toggle]')) onClose()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div ref={ref} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-deep-altar border border-white/[0.06] rounded-lg p-4 min-w-[220px]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="block py-2 px-3 text-[11px] tracking-[2px] uppercase text-muted hover:text-bone transition-colors whitespace-nowrap"
        >
          {link.name}
        </Link>
      ))}
    </div>
  )
}
