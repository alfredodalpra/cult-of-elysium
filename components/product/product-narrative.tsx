import type { Product } from '@/lib/shopify/types'

export function ProductNarrative({ product }: { product: Product }) {
  return (
    <div className="prose prose-invert max-w-none">
      <div
        className="text-sm text-muted leading-relaxed [&_p]:mb-4 [&_strong]:text-bone [&_strong]:font-medium [&_ul]:list-none [&_ul]:pl-0 [&_li]:text-muted [&_li]:text-sm [&_li]:mb-2 [&_li]:before:content-['·_'] [&_li]:before:text-ritual-violet"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
    </div>
  )
}
