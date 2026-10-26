import Image from 'next/image'
import Link from 'next/link'
import type { Collection } from '@/lib/shopify/types'

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.handle}`} className="group block">
      <div className="aspect-[4/3] sm:aspect-[16/9] relative overflow-hidden rounded-lg border border-white/[0.06] group-hover:border-ritual-violet/30 transition-all duration-500">
        {collection.image ? (
          <Image src={collection.image.url} alt={collection.image.altText ?? collection.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-deep-altar via-crypt to-deep-altar">
            <div className="absolute inset-0 bg-gradient-to-t from-ritual-violet/[0.04] to-transparent" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-xl tracking-[3px] uppercase text-bone">{collection.title}</h3>
          {collection.description && (
            <p className="text-xs text-muted/80 mt-2 line-clamp-2 leading-relaxed">{collection.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
