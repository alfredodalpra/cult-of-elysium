import { shopifyFetch } from './client'
import { reshapeCart, type ShopifyCart } from './reshape'
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

// Thrown when Shopify returns no cart. Usually the cart expired or was checked out, but
// Shopify also omits the cart for some rejected inputs (e.g. an unknown variant), so
// callers should confirm the cart is really gone before discarding it.
export class CartNotFoundError extends Error {
  constructor(message = 'Cart not found') {
    super(message)
    this.name = 'CartNotFoundError'
  }
}

// Thrown when Shopify rejects a cart change, e.g. a sold-out variant or a quantity limit.
// The message comes from Shopify's userErrors and is safe to show to the shopper.
export class CartUserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CartUserError'
  }
}

type CartPayload = {
  cart: ShopifyCart | null
  userErrors: { field: string[] | null; message: string }[]
}

const PAYLOAD_FIELDS = 'cart { ...CartFields } userErrors { field message }'

function unwrap(payload: CartPayload): Cart {
  if (!payload.cart) throw new CartNotFoundError(payload.userErrors[0]?.message)
  if (payload.userErrors.length) throw new CartUserError(payload.userErrors[0].message)
  return reshapeCart(payload.cart)
}

// Returns null when the cart no longer exists, e.g. it expired or was checked out.
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: `query GetCart($cartId: ID!) { cart(id: $cartId) { ...CartFields } } ${CART_FRAGMENT}`,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart ? reshapeCart(data.cart) : null
}

// Creates the cart together with its first line, so a failed add never leaves an empty cart behind.
export async function createCart(variantId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    query: `
      mutation CreateCart($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) { ${PAYLOAD_FIELDS} }
      }
      ${CART_FRAGMENT}
    `,
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
    cache: 'no-store',
  })
  return unwrap(data.cartCreate)
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    query: `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { ${PAYLOAD_FIELDS} }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    cache: 'no-store',
  })
  return unwrap(data.cartLinesAdd)
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    query: `
      mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { ${PAYLOAD_FIELDS} }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cache: 'no-store',
  })
  return unwrap(data.cartLinesUpdate)
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    query: `
      mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { ${PAYLOAD_FIELDS} }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  return unwrap(data.cartLinesRemove)
}
