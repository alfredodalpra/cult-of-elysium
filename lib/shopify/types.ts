export type Money = {
  amount: string
  currencyCode: string
}

export type Image = {
  url: string
  altText: string | null
  width: number
  height: number
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
  compareAtPrice: Money | null
  selectedOptions: { name: string; value: string }[]
  image: Image | null
}

export type Product = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  tags: string[]
  featuredImage: Image | null
  images: Image[]
  variants: ProductVariant[]
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  collections: { handle: string; title: string }[]
}

export type Collection = {
  id: string
  handle: string
  title: string
  description: string
  image: Image | null
  products: Product[]
}

export type CartItem = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: { title: string; handle: string; featuredImage: Image | null }
    price: Money
    selectedOptions: { name: string; value: string }[]
    image: Image | null
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
    totalTaxAmount: Money | null
  }
  lines: CartItem[]
}
