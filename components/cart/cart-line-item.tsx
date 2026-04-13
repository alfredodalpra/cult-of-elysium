'use client'

import Image from 'next/image'
import { useCart } from './cart-provider'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/lib/shopify/types'

export function CartLineItem({ item }: { item: CartItem }) {
  const { update, remove } = useCart()
  const image = item.merchandise.image ?? item.merchandise.product.featuredImage

  return (
    <div className="flex gap-4">
      {image && (
        <div className="w-20 h-24 relative rounded overflow-hidden bg-crypt flex-shrink-0">
          <Image src={image.url} alt={image.altText ?? ''} fill className="object-cover" sizes="80px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-sm tracking-wide truncate">{item.merchandise.product.title}</h3>
        <p className="text-[10px] text-muted mt-1">
          {item.merchandise.selectedOptions.map(o => o.value).join(' / ')}
        </p>
        <p className="text-sm text-muted mt-2">{formatPrice(item.merchandise.price)}</p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => item.quantity === 1 ? remove([item.id]) : update(item.id, item.quantity - 1)}
            className="text-muted hover:text-bone text-sm cursor-pointer bg-transparent border-none"
          >
            -
          </button>
          <span className="text-xs w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => update(item.id, item.quantity + 1)}
            className="text-muted hover:text-bone text-sm cursor-pointer bg-transparent border-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
