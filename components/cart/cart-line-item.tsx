'use client'

import Image from 'next/image'
import { useCart } from './cart-provider'
import { formatPrice } from '@/lib/utils'
import { MAX_QUANTITY } from '@/lib/shopify/constants'
import type { CartItem } from '@/lib/shopify/types'

export function CartLineItem({ item }: { item: CartItem }) {
  const { update, remove, isPending } = useCart()
  const image = item.merchandise.image ?? item.merchandise.product.featuredImage

  return (
    <div className="flex gap-4">
      {image && (
        <div className="w-20 h-24 relative rounded overflow-hidden bg-crypt flex-shrink-0">
          <Image src={image.url} alt={image.altText ?? item.merchandise.product.title} fill className="object-cover" sizes="80px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-sm tracking-wide truncate">{item.merchandise.product.title}</h3>
        <p className="text-[10px] text-muted mt-1">
          {item.merchandise.selectedOptions
            .filter(o => o.value !== 'Default' && o.value !== 'Default Title')
            .map(o => `${o.name} ${o.value}`)
            .join(' / ')}
        </p>
        <p className="text-sm text-muted mt-2">{formatPrice(item.merchandise.price)}</p>
        <div className="flex items-center gap-1 mt-1 -ml-2">
          <button
            onClick={() => item.quantity === 1 ? remove([item.id]) : update(item.id, Math.min(item.quantity - 1, MAX_QUANTITY))}
            // Quantities are sent as absolute values, so wait for each update to land
            // before allowing the next one; otherwise quick repeat clicks would be lost.
            disabled={isPending}
            aria-label={`Decrease quantity of ${item.merchandise.product.title}`}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-bone text-sm cursor-pointer bg-transparent border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="text-xs w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => update(item.id, item.quantity + 1)}
            disabled={isPending || item.quantity >= MAX_QUANTITY}
            aria-label={`Increase quantity of ${item.merchandise.product.title}`}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-bone text-sm cursor-pointer bg-transparent border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
