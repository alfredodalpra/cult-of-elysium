import { shopifyFetch } from './client'
import type { Cart } from './types'

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product { title handle featuredImage { url altText width height } }
            price { amount currencyCode }
            selectedOptions { name value }
            image { url altText width height }
          }
        }
      }
    }
  }
`

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
    query: `mutation { cartCreate { cart { ...CartFields } } } ${CART_FRAGMENT}`,
    cache: 'no-store',
  })
  return data.cartCreate.cart
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
    query: `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    cache: 'no-store',
  })
  return data.cartLinesAdd.cart
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query: `
      mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cache: 'no-store',
  })
  return data.cartLinesUpdate.cart
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query: `
      mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  return data.cartLinesRemove.cart
}
