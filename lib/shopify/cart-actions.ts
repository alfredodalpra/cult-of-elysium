'use server'

import { cookies } from 'next/headers'
import { isMock } from './config'
import * as shopify from './mutations'
import { CartNotFoundError, CartUserError } from './mutations'
import {
  addMockLine,
  buildMockCart,
  parseMockLines,
  removeMockLines,
  updateMockLine,
  type MockLine,
} from './mock-cart'
import type { Cart } from './types'

// Cart operations run on the server so the Storefront token never reaches the
// browser. The cart id (or, in demo mode, the cart lines) lives in a cookie,
// so the cart survives reloads and new tabs.
//
// Actions return a result instead of throwing for expected failures, because
// Next.js strips error messages from Server Actions in production.

export type CartResult = {
  // Present when the cart changed; null means the cart was cleared.
  cart?: Cart | null
  // Message to show the shopper.
  error?: string
}

const EXPIRED_MESSAGE = 'Your cart expired, so it has been cleared. Please add your items again.'
const INVALID_MESSAGE = 'That cart update is not valid.'
const MAX_QUANTITY = 99

// Server Actions are public endpoints, so their arguments are untrusted input.
function isQuantity(value: unknown, min: number): value is number {
  return Number.isInteger(value) && (value as number) >= min && (value as number) <= MAX_QUANTITY
}

function isId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 200
}

const CART_COOKIE = 'cartId'
const MOCK_CART_COOKIE = 'mockCart'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 14,
}

async function readMockLines(): Promise<MockLine[]> {
  return parseMockLines((await cookies()).get(MOCK_CART_COOKIE)?.value)
}

async function writeMockLines(lines: MockLine[]): Promise<Cart> {
  const cookieStore = await cookies()
  cookieStore.set(MOCK_CART_COOKIE, JSON.stringify(lines), cookieOptions)
  return buildMockCart(lines)
}

export async function getCart(): Promise<Cart | null> {
  if (isMock) return buildMockCart(await readMockLines())

  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return null

  const cart = await shopify.getCart(cartId)
  // Drop the id of a cart that expired or was checked out, so we stop asking for it.
  if (!cart) cookieStore.delete(CART_COOKIE)
  return cart
}

export async function addToCart(variantId: string, quantity = 1): Promise<CartResult> {
  if (!isId(variantId) || !isQuantity(quantity, 1)) return { error: INVALID_MESSAGE }
  if (isMock) return { cart: await writeMockLines(addMockLine(await readMockLines(), variantId, quantity)) }

  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value

  try {
    if (cartId) {
      try {
        return { cart: await shopify.addToCart(cartId, variantId, quantity) }
      } catch (err) {
        if (!(err instanceof CartNotFoundError)) throw err
        // Shopify returned no cart. If the cart still exists it rejected the item instead.
        if (await shopify.getCart(cartId)) return { error: err.message }
        // Otherwise the stored cart expired or was checked out: start a new one below.
      }
    }

    // Only point the cookie at the new cart once it exists with the item in it.
    const cart = await shopify.createCart(variantId, quantity)
    cookieStore.set(CART_COOKIE, cart.id, cookieOptions)
    return { cart }
  } catch (err) {
    if (err instanceof CartUserError || err instanceof CartNotFoundError) return { error: err.message }
    throw err
  }
}

// Runs a change against the stored cart, clearing it only if Shopify no longer knows it.
async function changeExistingCart(change: (cartId: string) => Promise<Cart>): Promise<CartResult> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return { cart: null, error: EXPIRED_MESSAGE }

  try {
    return { cart: await change(cartId) }
  } catch (err) {
    if (err instanceof CartNotFoundError) {
      if (await shopify.getCart(cartId)) return { error: err.message }
      cookieStore.delete(CART_COOKIE)
      return { cart: null, error: EXPIRED_MESSAGE }
    }
    if (err instanceof CartUserError) return { error: err.message }
    throw err
  }
}

export async function updateCartItem(lineId: string, quantity: number): Promise<CartResult> {
  if (!isId(lineId) || !isQuantity(quantity, 0)) return { error: INVALID_MESSAGE }
  if (isMock) return { cart: await writeMockLines(updateMockLine(await readMockLines(), lineId, quantity)) }

  return changeExistingCart(cartId =>
    quantity === 0
      ? shopify.removeFromCart(cartId, [lineId])
      : shopify.updateCartItem(cartId, lineId, quantity),
  )
}

export async function removeFromCart(lineIds: string[]): Promise<CartResult> {
  if (!Array.isArray(lineIds) || !lineIds.length || !lineIds.every(isId)) return { error: INVALID_MESSAGE }
  if (isMock) return { cart: await writeMockLines(removeMockLines(await readMockLines(), lineIds)) }

  return changeExistingCart(cartId => shopify.removeFromCart(cartId, lineIds))
}
