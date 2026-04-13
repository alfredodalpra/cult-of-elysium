'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Image as ShopifyImage } from '@/lib/shopify/types'

export function ProductGallery({ images }: { images: ShopifyImage[] }) {
  const [active, setActive] = useState(0)

  if (!images.length) return <div className="aspect-[4/5] bg-crypt rounded-lg" />

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-crypt">
        <Image
          src={images[active].url}
          alt={images[active].altText ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              className={`aspect-square relative overflow-hidden rounded bg-crypt border transition-colors cursor-pointer ${
                i === active ? 'border-ritual-violet/50' : 'border-white/[0.06] hover:border-white/20'
              }`}
            >
              <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
