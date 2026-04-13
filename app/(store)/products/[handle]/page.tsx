import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify/queries'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ProductNarrative } from '@/components/product/product-narrative'

export const revalidate = 300

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      <div className="mt-16 max-w-2xl">
        <ProductNarrative product={product} />
      </div>
    </div>
  )
}
