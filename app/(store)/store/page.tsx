import { getProducts, getCollections } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'
import { CollectionRow } from '@/components/store/collection-row'

export const revalidate = 300

export default async function StorePage() {
  const [products, collections] = await Promise.all([
    getProducts(12).catch(() => []),
    getCollections().catch(() => []),
  ])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="mb-20">
        <h2 className="font-display text-2xl tracking-[4px] uppercase text-bone mb-10">Featured</h2>
        <ProductGrid products={products} />
      </section>

      {collections.length > 0 && (
        <section>
          <h2 className="font-display text-2xl tracking-[4px] uppercase text-bone mb-10">Collections</h2>
          <CollectionRow collections={collections} />
        </section>
      )}
    </div>
  )
}
