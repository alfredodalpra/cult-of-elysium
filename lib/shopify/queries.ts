import { shopifyFetch } from './client'
import { isMock } from './config'
import { mockProducts, mockCollections } from './mock-data'
import { reshapeCollection, reshapeProduct, type ShopifyCollection, type ShopifyProduct } from './reshape'
import type { Product, Collection } from './types'

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        image { url altText width height }
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    collections(first: 5) {
      nodes { handle title }
    }
  }
`

export async function getProducts(first = 20): Promise<Product[]> {
  if (isMock) return mockProducts.slice(0, first)

  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: `
      query GetProducts($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) {
          nodes { ...ProductFields }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { first },
    tags: ['products'],
  })
  return data.products.nodes.map(reshapeProduct)
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (isMock) return mockProducts.find(p => p.handle === handle) ?? null

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: `
      query GetProduct($handle: String!) {
        product(handle: $handle) { ...ProductFields }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { handle },
    tags: ['products', `product-${handle}`],
  })
  return data.product ? reshapeProduct(data.product) : null
}

export async function getCollections(): Promise<Collection[]> {
  if (isMock) return mockCollections

  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>({
    query: `
      query GetCollections {
        collections(first: 20) {
          nodes {
            id
            handle
            title
            description
            image { url altText width height }
          }
        }
      }
    `,
    tags: ['collections'],
  })
  return data.collections.nodes.map(reshapeCollection)
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (isMock) return mockCollections.find(c => c.handle === handle) ?? null

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: `
      query GetCollection($handle: String!) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          image { url altText width height }
          products(first: 50, sortKey: BEST_SELLING) {
            nodes { ...ProductFields }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { handle },
    tags: ['collections', `collection-${handle}`],
  })
  return data.collection ? reshapeCollection(data.collection) : null
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (isMock) {
    const q = query.toLowerCase()
    return mockProducts.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }

  const data = await shopifyFetch<{ search: { nodes: ShopifyProduct[] } }>({
    query: `
      query Search($query: String!) {
        search(first: 20, query: $query, types: PRODUCT) {
          nodes {
            ... on Product { ...ProductFields }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { query },
    cache: 'no-store',
  })
  return data.search.nodes.map(reshapeProduct)
}
