'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/shopify/types'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const collection = product.collections?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/products/${product.handle}`} className="group block">
        <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-crypt border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
          {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </div>
        <div className="mt-4">
          {collection && (
            <p className="text-[9px] tracking-[3px] uppercase text-ritual-violet font-medium mb-1">
              {collection.title}
            </p>
          )}
          <h3 className="font-display text-base tracking-wide text-bone">{product.title}</h3>
          <p className="text-sm text-muted mt-1">{formatPrice(product.priceRange.minVariantPrice)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
