'use client'

import { createContext, useContext, useReducer, useCallback, useEffect, useTransition } from 'react'
import type { Cart } from '@/lib/shopify/types'
import { getCart, addToCart, updateCartItem, removeFromCart, type CartResult } from '@/lib/shopify/cart-actions'

type CartState = {
  cart: Cart | null
  isOpen: boolean
  error: string | null
}

type CartAction =
  | { type: 'SET_CART'; cart: Cart | null }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART': return { ...state, cart: action.cart, error: null }
    case 'SET_ERROR': return { ...state, error: action.error }
    case 'OPEN_CART': return { ...state, isOpen: true }
    case 'CLOSE_CART': return { ...state, isOpen: false, error: null }
  }
}

type CartContextType = CartState & {
  isPending: boolean
  add: (variantId: string, quantity?: number) => void
  update: (lineId: string, quantity: number) => void
  remove: (lineIds: string[]) => void
  open: () => void
  close: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: null, isOpen: false, error: null })
  const [isPending, startTransition] = useTransition()

  // Restore the cart saved in the cart cookie, so it survives reloads.
  useEffect(() => {
    getCart()
      .then(cart => dispatch({ type: 'SET_CART', cart }))
      .catch(err => console.error('Failed to load cart', err))
  }, [])

  const run = useCallback((action: () => Promise<CartResult>, openAfter = false) => {
    startTransition(async () => {
      try {
        const result = await action()
        // A rejected change leaves `cart` out, so the current cart stays on screen.
        if (result.cart !== undefined) dispatch({ type: 'SET_CART', cart: result.cart })
        if (result.error) dispatch({ type: 'SET_ERROR', error: result.error })
        if (openAfter || result.error) dispatch({ type: 'OPEN_CART' })
      } catch (err) {
        console.error('Cart update failed', err)
        dispatch({ type: 'SET_ERROR', error: 'Something went wrong. Please try again.' })
        dispatch({ type: 'OPEN_CART' })
      }
    })
  }, [])

  const add = useCallback((variantId: string, quantity = 1) => {
    run(() => addToCart(variantId, quantity), true)
  }, [run])

  const update = useCallback((lineId: string, quantity: number) => {
    run(() => updateCartItem(lineId, quantity))
  }, [run])

  const remove = useCallback((lineIds: string[]) => {
    run(() => removeFromCart(lineIds))
  }, [run])

  return (
    <CartContext.Provider value={{
      ...state, isPending,
      add, update, remove,
      open: () => dispatch({ type: 'OPEN_CART' }),
      close: () => dispatch({ type: 'CLOSE_CART' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
