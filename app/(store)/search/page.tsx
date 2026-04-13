import { searchProducts } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const products = q ? await searchProducts(q) : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone mb-4">Search</h1>
      {q && (
        <p className="text-sm text-muted mb-12">
          {products.length} results for &ldquo;{q}&rdquo;
        </p>
      )}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : q ? (
        <p className="text-muted text-center py-20">No products found</p>
      ) : null}
    </div>
  )
}
