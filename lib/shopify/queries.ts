import { shopifyFetch } from './client'
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
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>({
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
  return data.products.nodes
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: Product | null }>({
    query: `
      query GetProduct($handle: String!) {
        product(handle: $handle) { ...ProductFields }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { handle },
    tags: ['products', `product-${handle}`],
  })
  return data.product
}

export async function getCollections(): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: { nodes: Collection[] } }>({
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
  return data.collections.nodes
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const data = await shopifyFetch<{ collection: Collection | null }>({
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
  return data.collection
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await shopifyFetch<{ search: { nodes: Product[] } }>({
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
  return data.search.nodes
}
