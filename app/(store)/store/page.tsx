import type { Metadata } from 'next'
import { getProducts, getCollections } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'
import { CollectionRow } from '@/components/store/collection-row'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse sacred offerings: bracelets, necklaces, rings and earrings with a gothic, celestial soul.',
}

export default async function StorePage() {
  const [products, collections] = await Promise.all([
    getProducts(12),
    getCollections(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero section for store entry */}
      <section className="text-center mb-20 pt-8">
        <h1 className="font-display text-4xl tracking-[8px] uppercase text-bone mb-4">Sacred Offerings</h1>
        <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
          Each piece is a relic — forged with intention, gifted from a place beyond the mortal veil.
        </p>
        <div className="mt-8 w-12 h-px bg-ritual-violet/30 mx-auto" />
      </section>

      {/* Featured products */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-ritual-violet/40" />
          <h2 className="font-display text-xl tracking-[4px] uppercase text-bone">Featured</h2>
        </div>
        <ProductGrid products={products} />
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-ritual-violet/40" />
            <h2 className="font-display text-xl tracking-[4px] uppercase text-bone">Collections</h2>
          </div>
          <CollectionRow collections={collections} />
        </section>
      )}
    </div>
  )
}
