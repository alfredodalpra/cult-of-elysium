import type { Cart, CartItem, Collection, Image, Product, ProductVariant } from './types'

// The Storefront API wraps lists in connections ({ nodes: [...] }).
// These helpers flatten them into the plain arrays the UI works with.

type Connection<T> = { nodes: T[] }

export type ShopifyProduct = Omit<Product, 'images' | 'variants' | 'collections'> & {
  images: Connection<Image>
  variants: Connection<ProductVariant>
  collections: Connection<{ handle: string; title: string }>
}

export type ShopifyCollection = Omit<Collection, 'products'> & {
  products?: Connection<ShopifyProduct>
}

export type ShopifyCart = Omit<Cart, 'lines'> & {
  lines: Connection<CartItem>
}

export function reshapeProduct(product: ShopifyProduct): Product {
  return {
    ...product,
    images: product.images.nodes,
    variants: product.variants.nodes,
    collections: product.collections.nodes,
  }
}

export function reshapeCollection(collection: ShopifyCollection): Collection {
  return {
    ...collection,
    products: collection.products?.nodes.map(reshapeProduct) ?? [],
  }
}

export function reshapeCart(cart: ShopifyCart): Cart {
  return { ...cart, lines: cart.lines.nodes }
}
