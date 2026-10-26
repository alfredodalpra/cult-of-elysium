import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }

  const image = collection.image
  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: collection.title,
      description: collection.description,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.altText ?? collection.title }] : undefined,
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone">{collection.title}</h1>
        {collection.description && (
          <p className="text-sm text-muted mt-4 max-w-xl">{collection.description}</p>
        )}
      </div>
      <ProductGrid products={collection.products} />
    </div>
  )
}
