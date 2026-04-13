import { CollectionCard } from './collection-card'
import type { Collection } from '@/lib/shopify/types'

export function CollectionRow({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((c) => (
        <CollectionCard key={c.id} collection={c} />
      ))}
    </div>
  )
}
