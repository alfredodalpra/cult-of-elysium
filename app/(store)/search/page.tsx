import type { Metadata } from 'next'
import { searchProducts } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'
import { buttonClasses } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the Cult of Elysium jewelry collection.',
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const products = query ? await searchProducts(query).catch(() => []) : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone mb-8">Search</h1>

      {/* A plain GET form, so search works before (or without) JavaScript. */}
      <form action="/search" role="search" className="flex flex-col sm:flex-row gap-3 max-w-xl mb-10">
        <label htmlFor="search-q" className="sr-only">Search products</label>
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Rings, obsidian, serpent…"
          className="flex-1 bg-deep-altar border border-white/10 focus:border-ritual-violet/60 outline-none px-4 py-3 text-sm text-bone placeholder:text-muted/60 transition-colors"
        />
        <button type="submit" className={buttonClasses('ritual', 'py-3')}>Search</button>
      </form>

      {query && (
        <p className="text-sm text-muted mb-12">
          {products.length} {products.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
        </p>
      )}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : query ? (
        <p className="text-muted text-center py-20">No products found</p>
      ) : null}
    </div>
  )
}
