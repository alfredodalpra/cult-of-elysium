import { getCollections } from '@/lib/shopify/queries'
import { CollectionRow } from '@/components/store/collection-row'

export const revalidate = 300

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone mb-12">Collections</h1>
      <CollectionRow collections={collections} />
    </div>
  )
}
