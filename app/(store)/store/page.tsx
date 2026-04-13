import { getProducts, getCollections } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'
import { CollectionRow } from '@/components/store/collection-row'
import { PlaceholderGrid } from '@/components/store/placeholder-card'

export const revalidate = 300

const placeholderCollections = [
  { id: '1', handle: 'the-relic-collection', title: 'The Relic Collection', description: 'Altarwear and gothic symbolism — heavy, glittering relics for sacred devotion.', image: null, products: [] },
  { id: '2', handle: 'the-star-vault', title: 'The Star Vault', description: 'Celestial offerings from the cosmos — astral crowns, lunar pendants, starborn rings.', image: null, products: [] },
  { id: '3', handle: 'the-binding-rite', title: 'The Binding Rite', description: 'Vows forged in darkness — rings, bands, and bonds for the devoted.', image: null, products: [] },
]

export default async function StorePage() {
  const [products, collections] = await Promise.all([
    getProducts(12).catch(() => []),
    getCollections().catch(() => []),
  ])

  const hasProducts = products.length > 0
  const hasCollections = collections.length > 0

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
        {hasProducts ? (
          <ProductGrid products={products} />
        ) : (
          <PlaceholderGrid />
        )}
      </section>

      {/* Collections */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-ritual-violet/40" />
          <h2 className="font-display text-xl tracking-[4px] uppercase text-bone">Collections</h2>
        </div>
        <CollectionRow collections={hasCollections ? collections : placeholderCollections} />
      </section>
    </div>
  )
}
