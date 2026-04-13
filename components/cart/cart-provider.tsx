'use client'

import { createContext, useContext, useReducer, useCallback, useEffect, useTransition } from 'react'
import type { Cart } from '@/lib/shopify/types'
import { createCart, addToCart, updateCartItem, removeFromCart } from '@/lib/shopify/mutations'

type CartState = {
  cart: Cart | null
  isOpen: boolean
}

type CartAction =
  | { type: 'SET_CART'; cart: Cart }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART': return { ...state, cart: action.cart }
    case 'OPEN_CART': return { ...state, isOpen: true }
    case 'CLOSE_CART': return { ...state, isOpen: false }
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
  const [state, dispatch] = useReducer(cartReducer, { cart: null, isOpen: false })
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const cartId = localStorage.getItem('cartId')
    if (!cartId) return
  }, [])

  const ensureCart = useCallback(async (): Promise<string> => {
    if (state.cart?.id) return state.cart.id
    const cart = await createCart()
    dispatch({ type: 'SET_CART', cart })
    localStorage.setItem('cartId', cart.id)
    return cart.id
  }, [state.cart?.id])

  const add = useCallback((variantId: string, quantity = 1) => {
    startTransition(async () => {
      const cartId = await ensureCart()
      const cart = await addToCart(cartId, variantId, quantity)
      dispatch({ type: 'SET_CART', cart })
      dispatch({ type: 'OPEN_CART' })
    })
  }, [ensureCart])

  const update = useCallback((lineId: string, quantity: number) => {
    if (!state.cart?.id) return
    startTransition(async () => {
      const cart = await updateCartItem(state.cart!.id, lineId, quantity)
      dispatch({ type: 'SET_CART', cart })
    })
  }, [state.cart?.id])

  const remove = useCallback((lineIds: string[]) => {
    if (!state.cart?.id) return
    startTransition(async () => {
      const cart = await removeFromCart(state.cart!.id, lineIds)
      dispatch({ type: 'SET_CART', cart })
    })
  }, [state.cart?.id])

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
