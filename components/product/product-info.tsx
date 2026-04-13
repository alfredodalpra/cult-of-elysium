'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { VariantSelector } from './variant-selector'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/shopify/types'

export function ProductInfo({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.variants[0])
  const { add, isPending } = useCart()
  const collection = product.collections?.[0]

  return (
    <div className="flex flex-col gap-5">
      {collection && (
        <p className="text-[10px] tracking-[4px] uppercase text-ritual-violet font-medium">
          {collection.title}
        </p>
      )}
      <h1 className="font-display text-3xl tracking-wide text-bone leading-tight">{product.title}</h1>
      <p className="text-xl text-silver-relic font-light">{formatPrice(selected.price)}</p>

      {product.variants.length > 1 && (
        <VariantSelector variants={product.variants} selected={selected} onSelect={setSelected} />
      )}

      <div className="flex flex-col gap-3 mt-2">
        <Button variant="primary" onClick={() => add(selected.id)} disabled={isPending || !selected.availableForSale}>
          {!selected.availableForSale ? 'Sold Out' : isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
