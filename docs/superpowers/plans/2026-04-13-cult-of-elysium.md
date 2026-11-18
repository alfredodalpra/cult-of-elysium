# Cult of Elysium — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a headless Shopify storefront for an alternative jewelry brand using Next.js App Router, Tailwind CSS, and Framer Motion — with a cinematic animated homepage.

**Architecture:** Monolithic Next.js app with route groups: `(marketing)` for homepage/about (no shop nav), `(store)` for shop pages (with nav). Shopify Storefront API called from Server Components, cached with ISR. Cart managed client-side via React Context + Shopify Cart API. Hero animation uses a two-canvas approach: pre-rendered painted nebula background + animated foreground with orbs and twinkling stars.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Shopify Storefront API (GraphQL), TypeScript

**Project root:** `C:/Users/alfre/Documents/GitHub/Claude/cult-of-elysium`

---

## File Map

```
cult-of-elysium/
├── app/
│   ├── layout.tsx                          # Root layout: fonts, metadata, cart provider
│   ├── globals.css                         # Tailwind imports + design tokens
│   ├── (marketing)/
│   │   ├── layout.tsx                      # Marketing layout (no nav)
│   │   ├── page.tsx                        # Homepage — hero animation
│   │   └── about/page.tsx                  # Minimal about page
│   ├── (store)/
│   │   ├── layout.tsx                      # Store layout: navbar + footer + cart drawer
│   │   ├── page.tsx                        # Store entry: featured + collections
│   │   ├── products/[handle]/page.tsx      # Product detail page
│   │   ├── collections/page.tsx            # All collections
│   │   ├── collections/[handle]/page.tsx   # Single collection
│   │   └── search/page.tsx                 # Search results
│   └── api/revalidate/route.ts             # Shopify webhook for ISR
├── components/
│   ├── hero/
│   │   ├── hero-canvas.tsx                 # Client component: two-canvas animation
│   │   └── hero-overlay.tsx                # Framer Motion text + transition
│   ├── store/
│   │   ├── product-card.tsx                # Product grid card
│   │   ├── product-grid.tsx                # Responsive grid with stagger animation
│   │   ├── collection-card.tsx             # Collection preview card
│   │   └── collection-row.tsx              # Horizontal collection showcase
│   ├── product/
│   │   ├── product-gallery.tsx             # Image gallery
│   │   ├── product-info.tsx                # Price, variants, add-to-cart
│   │   ├── product-narrative.tsx           # Description/lore section
│   │   └── variant-selector.tsx            # Color dot variant picker
│   ├── cart/
│   │   ├── cart-provider.tsx               # React Context for cart state
│   │   ├── cart-drawer.tsx                 # Slide-out cart panel
│   │   └── cart-line-item.tsx              # Single cart item row
│   ├── layout/
│   │   ├── navbar.tsx                      # Minimal nav: Shop/Collections/About/Cart
│   │   ├── shop-dropdown.tsx               # Category dropdown under "Shop"
│   │   ├── footer.tsx                      # Brand footer
│   │   └── page-transition.tsx             # Framer Motion layout transition
│   └── ui/
│       ├── button.tsx                      # Button variants (primary/outline/ritual/ghost)
│       └── loading-skeleton.tsx            # Skeleton loader for products
├── lib/
│   ├── shopify/
│   │   ├── client.ts                       # GraphQL client for Storefront API
│   │   ├── queries.ts                      # Product/collection/search queries
│   │   ├── mutations.ts                    # Cart mutations
│   │   └── types.ts                        # TypeScript types
│   ├── fonts.ts                            # Marcellus + Outfit font config
│   └── utils.ts                            # Price formatting, etc.
├── public/
│   └── (empty — images from Shopify CDN)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                              # SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_STORE_DOMAIN
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `cult-of-elysium/` (entire scaffold)
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- Create: `app/layout.tsx`, `app/globals.css`
- Create: `lib/fonts.ts`
- Create: `.env.local`

- [ ] **Step 1: Create Next.js project**

```bash
cd "C:/Users/alfre/Documents/GitHub/Claude"
npx create-next-app@latest cult-of-elysium --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Accept defaults. This creates the base project with App Router, Tailwind v4, TypeScript.

- [ ] **Step 2: Install dependencies**

```bash
cd cult-of-elysium
npm install framer-motion
```

- [ ] **Step 3: Create font config**

Create `lib/fonts.ts`:
```typescript
import { Marcellus, Outfit } from 'next/font/google'

export const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})
```

- [ ] **Step 4: Set up globals.css with design tokens**

Replace `app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-void: #070709;
  --color-deep-altar: #0f0f14;
  --color-crypt: #1a1a22;
  --color-bone: #f0ede8;
  --color-ritual-violet: #6d5acd;
  --color-celestine: #c4b5fd;
  --color-abyss-blue: #1e3a5f;
  --color-silver-relic: #9ca3af;
  --color-muted: #7a7672;

  --font-display: var(--font-marcellus), serif;
  --font-body: var(--font-outfit), sans-serif;
}

body {
  background-color: var(--color-void);
  color: var(--color-bone);
  font-family: var(--font-body);
}
```

- [ ] **Step 5: Set up root layout**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { marcellus, outfit } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cult of Elysium',
  description: 'Sacred jewelry from the goddess of night',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Create .env.local**

Create `.env.local`:
```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here
```

- [ ] **Step 7: Update next.config.ts for Shopify images**

Replace `next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 8: Verify scaffold**

```bash
npm run dev
```

Open `http://localhost:3000`, verify the page loads with dark background and correct fonts.

- [ ] **Step 9: Init git and commit**

```bash
git init
git add .
git commit -m "feat: project scaffold — Next.js, Tailwind, fonts, design tokens"
```

---

## Task 2: Shopify Client & Types

**Files:**
- Create: `lib/shopify/client.ts`
- Create: `lib/shopify/types.ts`
- Create: `lib/shopify/queries.ts`
- Create: `lib/shopify/mutations.ts`
- Create: `lib/utils.ts`

- [ ] **Step 1: Create Shopify types**

Create `lib/shopify/types.ts`:
```typescript
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
```

- [ ] **Step 2: Create GraphQL client**

Create `lib/shopify/client.ts`:
```typescript
const domain = process.env.SHOPIFY_STORE_DOMAIN!
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
}): Promise<T> {
  const response = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: tags ? { tags } : undefined,
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}
```

- [ ] **Step 3: Create product and collection queries**

Create `lib/shopify/queries.ts`:
```typescript
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
```

- [ ] **Step 4: Create cart mutations**

Create `lib/shopify/mutations.ts`:
```typescript
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
```

- [ ] **Step 5: Create utils**

Create `lib/utils.ts`:
```typescript
import type { Money } from '@/lib/shopify/types'

export function formatPrice(money: Money): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount))
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: Shopify client, types, queries, mutations, utils"
```

---

## Task 3: Cart Provider

**Files:**
- Create: `components/cart/cart-provider.tsx`
- Modify: `app/layout.tsx` (wrap with provider)

- [ ] **Step 1: Create cart context provider**

Create `components/cart/cart-provider.tsx`:
```tsx
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
    // Cart will be lazily created on first add
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
```

- [ ] **Step 2: Wrap root layout with CartProvider**

Update `app/layout.tsx` — add `import { CartProvider } from '@/components/cart/cart-provider'` and wrap `{children}` with `<CartProvider>{children}</CartProvider>`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: cart context provider with Shopify Cart API"
```

---

## Task 4: UI Primitives & Layout Components

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/loading-skeleton.tsx`
- Create: `components/layout/navbar.tsx`
- Create: `components/layout/shop-dropdown.tsx`
- Create: `components/layout/footer.tsx`
- Create: `components/cart/cart-drawer.tsx`
- Create: `components/cart/cart-line-item.tsx`

- [ ] **Step 1: Create button component**

Create `components/ui/button.tsx`:
```tsx
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ritual' | 'ghost'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-body text-[11px] font-medium tracking-[3px] uppercase px-10 py-4 transition-all duration-400 cursor-pointer',
        variant === 'primary' && 'bg-bone text-void hover:bg-white hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(240,237,232,0.15)]',
        variant === 'outline' && 'bg-transparent text-bone border border-white/20 hover:border-white/50 hover:bg-white/[0.03]',
        variant === 'ritual' && 'bg-transparent text-celestine border border-ritual-violet/40 hover:border-ritual-violet/80 hover:bg-ritual-violet/[0.08] hover:shadow-[0_0_30px_rgba(109,90,205,0.15)]',
        variant === 'ghost' && 'bg-transparent text-muted border-none px-5 hover:text-bone',
        className,
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 2: Create loading skeleton**

Create `components/ui/loading-skeleton.tsx`:
```tsx
export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className ?? ''}`} />
}
```

- [ ] **Step 3: Create navbar**

Create `components/layout/navbar.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/cart/cart-provider'
import { ShopDropdown } from './shop-dropdown'

export function Navbar() {
  const { cart, open } = useCart()
  const [shopOpen, setShopOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-void/90 backdrop-blur-xl border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/store" className="font-display text-base tracking-[5px] uppercase text-bone">
          Cult of Elysium
        </Link>
        <ul className="flex gap-10 list-none">
          <li className="relative">
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors cursor-pointer bg-transparent border-none font-body"
            >
              Shop
            </button>
            {shopOpen && <ShopDropdown onClose={() => setShopOpen(false)} />}
          </li>
          <li>
            <Link href="/collections" className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors">
              Collections
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors">
              About
            </Link>
          </li>
        </ul>
        <button onClick={open} className="text-[11px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors cursor-pointer bg-transparent border-none font-body">
          Cart ({cart?.totalQuantity ?? 0})
        </button>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Create shop dropdown**

Create `components/layout/shop-dropdown.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const categories = [
  { name: 'All Products', href: '/store' },
  { name: 'Necklaces', href: '/collections/necklaces' },
  { name: 'Bracelets', href: '/collections/bracelets' },
  { name: 'Earrings', href: '/collections/earrings' },
  { name: 'Offerings', href: '/collections/offerings' },
]

export function ShopDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div ref={ref} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-deep-altar border border-white/[0.06] rounded-lg p-4 min-w-[180px]">
      {categories.map((cat) => (
        <Link
          key={cat.href}
          href={cat.href}
          onClick={onClose}
          className="block py-2 px-3 text-[11px] tracking-[2px] uppercase text-muted hover:text-bone transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create footer**

Create `components/layout/footer.tsx`:
```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="font-display text-sm tracking-[5px] uppercase text-bone/60">
          Cult of Elysium
        </div>
        <div className="flex gap-8">
          {['Shop', 'Collections', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[10px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="text-[10px] text-muted/50 tracking-[2px]">
          &copy; {new Date().getFullYear()} Cult of Elysium
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: Create cart drawer**

Create `components/cart/cart-drawer.tsx`:
```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './cart-provider'
import { CartLineItem } from './cart-line-item'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { cart, isOpen, close, isPending } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-deep-altar border-l border-white/[0.06] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-display text-lg tracking-[3px] uppercase">Cart</h2>
              <button onClick={close} className="text-muted hover:text-bone transition-colors text-sm cursor-pointer bg-transparent border-none">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {!cart?.lines.length ? (
                <p className="text-muted text-sm text-center py-12">Your cart is empty</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {cart.lines.map((item) => (
                    <CartLineItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
            {cart && cart.lines.length > 0 && (
              <div className="p-6 border-t border-white/[0.06]">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="text-sm">{formatPrice(cart.cost.subtotalAmount)}</span>
                </div>
                <a href={cart.checkoutUrl}>
                  <Button variant="primary" className="w-full" disabled={isPending}>
                    {isPending ? 'Updating...' : 'Checkout'}
                  </Button>
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 7: Create cart line item**

Create `components/cart/cart-line-item.tsx`:
```tsx
'use client'

import Image from 'next/image'
import { useCart } from './cart-provider'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/lib/shopify/types'

export function CartLineItem({ item }: { item: CartItem }) {
  const { update, remove } = useCart()
  const image = item.merchandise.image ?? item.merchandise.product.featuredImage

  return (
    <div className="flex gap-4">
      {image && (
        <div className="w-20 h-24 relative rounded overflow-hidden bg-crypt flex-shrink-0">
          <Image src={image.url} alt={image.altText ?? ''} fill className="object-cover" sizes="80px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-sm tracking-wide truncate">{item.merchandise.product.title}</h3>
        <p className="text-[10px] text-muted mt-1">
          {item.merchandise.selectedOptions.map(o => o.value).join(' / ')}
        </p>
        <p className="text-sm text-muted mt-2">{formatPrice(item.merchandise.price)}</p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => item.quantity === 1 ? remove([item.id]) : update(item.id, item.quantity - 1)}
            className="text-muted hover:text-bone text-sm cursor-pointer bg-transparent border-none"
          >
            -
          </button>
          <span className="text-xs w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => update(item.id, item.quantity + 1)}
            className="text-muted hover:text-bone text-sm cursor-pointer bg-transparent border-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: UI primitives, navbar, footer, cart drawer"
```

---

## Task 5: Store Layout & Pages

**Files:**
- Create: `app/(store)/layout.tsx`
- Create: `app/(store)/page.tsx`
- Create: `components/store/product-card.tsx`
- Create: `components/store/product-grid.tsx`
- Create: `components/store/collection-card.tsx`
- Create: `components/store/collection-row.tsx`

- [ ] **Step 1: Create store layout**

Create `app/(store)/layout.tsx`:
```tsx
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Create product card**

Create `components/store/product-card.tsx`:
```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/shopify/types'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const collection = product.collections?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/products/${product.handle}`} className="group block">
        <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-crypt border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
          {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </div>
        <div className="mt-4">
          {collection && (
            <p className="text-[9px] tracking-[3px] uppercase text-ritual-violet font-medium mb-1">
              {collection.title}
            </p>
          )}
          <h3 className="font-display text-base tracking-wide text-bone">{product.title}</h3>
          <p className="text-sm text-muted mt-1">{formatPrice(product.priceRange.minVariantPrice)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 3: Create product grid**

Create `components/store/product-grid.tsx`:
```tsx
import { ProductCard } from './product-card'
import type { Product } from '@/lib/shopify/types'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create collection card and row**

Create `components/store/collection-card.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Collection } from '@/lib/shopify/types'

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.handle}`} className="group block">
      <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-crypt border border-white/[0.06] group-hover:border-ritual-violet/30 transition-all duration-500">
        {collection.image && (
          <Image src={collection.image.url} alt={collection.image.altText ?? collection.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-xl tracking-[3px] uppercase text-bone">{collection.title}</h3>
          <p className="text-xs text-muted mt-2 line-clamp-2">{collection.description}</p>
        </div>
      </div>
    </Link>
  )
}
```

Create `components/store/collection-row.tsx`:
```tsx
import { CollectionCard } from './collection-card'
import type { Collection } from '@/lib/shopify/types'

export function CollectionRow({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((c) => (
        <CollectionCard key={c.id} collection={c} />
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create store entry page**

Create `app/(store)/page.tsx`:
```tsx
import { getProducts, getCollections } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'
import { CollectionRow } from '@/components/store/collection-row'

export const revalidate = 300 // ISR: 5 minutes

export default async function StorePage() {
  const [products, collections] = await Promise.all([
    getProducts(12),
    getCollections(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="mb-20">
        <h2 className="font-display text-2xl tracking-[4px] uppercase text-bone mb-10">Featured</h2>
        <ProductGrid products={products} />
      </section>

      {collections.length > 0 && (
        <section>
          <h2 className="font-display text-2xl tracking-[4px] uppercase text-bone mb-10">Collections</h2>
          <CollectionRow collections={collections} />
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Verify store page**

```bash
npm run dev
```

Open `http://localhost:3000/store` — should show the store layout with navbar, product grid (empty if no Shopify token), and footer. Verify dark theme, fonts, spacing.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: store layout, product grid, collection cards, store entry page"
```

---

## Task 6: Homepage Hero Animation

**Files:**
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `components/hero/hero-canvas.tsx`
- Create: `components/hero/hero-overlay.tsx`

- [ ] **Step 1: Create marketing layout**

Create `app/(marketing)/layout.tsx`:
```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Create hero canvas component**

Create `components/hero/hero-canvas.tsx` — this is the two-canvas animation from the `hero-soul.html` prototype, ported to a React client component:

```tsx
'use client'

import { useEffect, useRef } from 'react'

type Orb = {
  x: number; y: number; r: number; vx: number; vy: number
  phase: number; pulseSpeed: number; hue: number; brightness: number
}
type Twinkler = {
  x: number; y: number; s: number; phase: number; speed: number
  baseA: number; peakA: number; hue: number
}

export function HeroCanvas() {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const fgRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, on: false })
  const stateRef = useRef<{ orbs: Orb[]; twinklers: Twinkler[] }>({ orbs: [], twinklers: [] })

  useEffect(() => {
    const bgCanvas = bgRef.current!
    const fgCanvas = fgRef.current!
    const bg = bgCanvas.getContext('2d')!
    const fg = fgCanvas.getContext('2d')!
    let W: number, H: number, dpr: number
    let animId: number

    function resize() {
      const parent = bgCanvas.parentElement!
      const rect = parent.getBoundingClientRect()
      dpr = devicePixelRatio
      W = rect.width; H = rect.height
      for (const c of [bgCanvas, fgCanvas]) {
        c.width = W * dpr; c.height = H * dpr
        c.style.width = W + 'px'; c.style.height = H + 'px'
      }
      paintBackground()
      initForeground()
    }

    function paintBackground() {
      bg.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cx = W / 2, cy = H / 2

      const base = bg.createRadialGradient(cx, cy * .85, 0, cx, cy * .85, W * .7)
      base.addColorStop(0, '#100e1a'); base.addColorStop(.5, '#0a0912'); base.addColorStop(1, '#06050b')
      bg.fillStyle = base; bg.fillRect(0, 0, W, H)

      const washes = [
        { x: cx * .7, y: cy * .6, r: W * .35, c: [[70,45,140,.12],[50,30,120,.06]] },
        { x: cx * 1.4, y: cy * 1.2, r: W * .3, c: [[90,60,160,.1],[60,40,130,.05]] },
        { x: cx * .4, y: cy * 1.5, r: W * .25, c: [[55,35,130,.08],[40,25,110,.04]] },
        { x: cx * 1.6, y: cy * .4, r: W * .22, c: [[80,55,150,.09],[50,35,120,.04]] },
        { x: cx, y: cy, r: W * .4, c: [[65,50,145,.07],[45,30,115,.03]] },
        { x: cx * .3, y: cy * .3, r: W * .18, c: [[75,50,155,.07],[55,35,125,.03]] },
        { x: cx * 1.7, y: cy * 1.6, r: W * .2, c: [[60,40,140,.06],[40,28,110,.03]] },
      ]
      for (const w of washes) {
        const g = bg.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r)
        g.addColorStop(0, `rgba(${w.c[0].join(',')})`)
        g.addColorStop(.5, `rgba(${w.c[1].join(',')})`)
        g.addColorStop(1, 'transparent')
        bg.fillStyle = g; bg.fillRect(0, 0, W, H)
      }

      const accents = [
        { x: cx * .55, y: cy * .75, r: 80, a: .06 },
        { x: cx * 1.35, y: cy * 1.1, r: 60, a: .07 },
        { x: cx * 1.1, y: cy * .5, r: 50, a: .05 },
        { x: cx * .8, y: cy * 1.4, r: 70, a: .05 },
        { x: cx, y: cy * .9, r: 100, a: .04 },
      ]
      for (const a of accents) {
        const g = bg.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r)
        g.addColorStop(0, `rgba(120,95,200,${a.a})`)
        g.addColorStop(.5, `rgba(90,70,170,${a.a * .4})`)
        g.addColorStop(1, 'transparent')
        bg.fillStyle = g; bg.fillRect(0, 0, W, H)
      }

      // Grain
      const imgData = bg.getImageData(0, 0, W * dpr, H * dpr)
      const d = imgData.data
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - .5) * 6
        d[i] += n; d[i + 1] += n; d[i + 2] += n
      }
      bg.putImageData(imgData, 0, 0)

      // Stars
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * W, y = Math.random() * H
        const tier = Math.random()
        const sz = tier < .7 ? .5 + Math.random() * .5 : tier < .9 ? 1 + Math.random() : 1.5 + Math.random() * 1.5
        const a = tier < .7 ? .15 + Math.random() * .2 : tier < .9 ? .25 + Math.random() * .3 : .4 + Math.random() * .3
        bg.beginPath(); bg.arc(x, y, sz, 0, Math.PI * 2)
        bg.fillStyle = `rgba(210,200,240,${a})`; bg.fill()
        if (sz > 1.2) {
          const h = Math.random()
          const [hr, hg, hb] = h < .4 ? [130,110,220] : h < .7 ? [100,90,200] : [160,140,230]
          const g = bg.createRadialGradient(x, y, sz, x, y, sz * 4)
          g.addColorStop(0, `rgba(${hr},${hg},${hb},${a * .15})`); g.addColorStop(1, 'transparent')
          bg.fillStyle = g; bg.beginPath(); bg.arc(x, y, sz * 4, 0, Math.PI * 2); bg.fill()
        }
      }
    }

    function initForeground() {
      const orbs: Orb[] = []
      for (let i = 0; i < 18; i++) {
        orbs.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 15 + Math.random() * 35,
          vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .1,
          phase: Math.random() * 6.28, pulseSpeed: .0006 + Math.random() * .0008,
          hue: Math.floor(Math.random() * 3), brightness: .04 + Math.random() * .04,
        })
      }
      const twinklers: Twinkler[] = []
      for (let i = 0; i < 60; i++) {
        twinklers.push({
          x: Math.random() * W, y: Math.random() * H,
          s: .5 + Math.random() * 1.5, phase: Math.random() * 6.28,
          speed: .003 + Math.random() * .005,
          baseA: .05 + Math.random() * .15, peakA: .4 + Math.random() * .4,
          hue: Math.floor(Math.random() * 3),
        })
      }
      stateRef.current = { orbs, twinklers }
    }

    function drawFg(t: number) {
      fg.setTransform(dpr, 0, 0, dpr, 0, 0)
      fg.clearRect(0, 0, W, H)
      const { orbs, twinklers } = stateRef.current
      const m = mouseRef.current

      for (const o of orbs) {
        o.x += o.vx + Math.sin(t * .0002 + o.phase) * .05
        o.y += o.vy + Math.cos(t * .00018 + o.phase) * .04
        if (o.x < -o.r * 2) o.x = W + o.r; if (o.x > W + o.r * 2) o.x = -o.r
        if (o.y < -o.r * 2) o.y = H + o.r; if (o.y > H + o.r * 2) o.y = -o.r

        const pulse = Math.sin(t * o.pulseSpeed + o.phase) * .3 + .7
        let br = o.brightness * pulse, cr = o.r * pulse
        if (m.on) {
          const dx = o.x - m.x, dy = o.y - m.y, dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 250) {
            const f = 1 - dist / 250
            br += f * .08; cr *= (1 + f * .2)
            o.x += dx / (dist + 1) * f * 1.5; o.y += dy / (dist + 1) * f * 1.5
          }
        }

        const [rr, gg, bb] = o.hue === 0 ? [109,90,205] : o.hue === 1 ? [90,75,185] : [75,65,165]
        const g1 = fg.createRadialGradient(o.x, o.y, 0, o.x, o.y, cr * 2)
        g1.addColorStop(0, `rgba(${rr+25},${gg+20},${bb+15},${br*1.2})`)
        g1.addColorStop(.3, `rgba(${rr},${gg},${bb},${br*.5})`)
        g1.addColorStop(.7, `rgba(${rr-15},${gg-10},${bb-5},${br*.1})`)
        g1.addColorStop(1, 'transparent')
        fg.fillStyle = g1; fg.beginPath(); fg.arc(o.x, o.y, cr * 2, 0, Math.PI * 2); fg.fill()

        const g2 = fg.createRadialGradient(o.x, o.y, 0, o.x, o.y, cr * .4)
        g2.addColorStop(0, `rgba(${rr+50},${gg+45},${bb+25},${br*2})`)
        g2.addColorStop(1, 'transparent')
        fg.fillStyle = g2; fg.beginPath(); fg.arc(o.x, o.y, cr * .4, 0, Math.PI * 2); fg.fill()
      }

      for (const s of twinklers) {
        const cycle = (Math.sin(t * s.speed + s.phase) + 1) / 2
        const a = s.baseA + Math.pow(cycle, 4) * (s.peakA - s.baseA)
        const [rr, gg, bb] = s.hue === 0 ? [220,210,245] : s.hue === 1 ? [190,175,235] : [175,170,225]
        let boost = 0
        if (m.on) {
          const md = Math.sqrt((s.x - m.x) ** 2 + (s.y - m.y) ** 2)
          if (md < 180) boost = (1 - md / 180) * .3
        }
        const fa = Math.min(a + boost, .9)
        fg.beginPath(); fg.arc(s.x, s.y, s.s, 0, Math.PI * 2)
        fg.fillStyle = `rgba(${rr},${gg},${bb},${fa})`; fg.fill()
        if (a > .3) {
          const spike = s.s * 3 * a
          fg.strokeStyle = `rgba(${rr},${gg},${bb},${a * .2})`; fg.lineWidth = .5
          fg.beginPath(); fg.moveTo(s.x, s.y - spike); fg.lineTo(s.x, s.y + spike); fg.stroke()
          fg.beginPath(); fg.moveTo(s.x - spike, s.y); fg.lineTo(s.x + spike, s.y); fg.stroke()
        }
        if (a > .25) {
          const g = fg.createRadialGradient(s.x, s.y, s.s, s.x, s.y, s.s * 4)
          g.addColorStop(0, `rgba(109,90,205,${a * .1})`); g.addColorStop(1, 'transparent')
          fg.fillStyle = g; fg.beginPath(); fg.arc(s.x, s.y, s.s * 4, 0, Math.PI * 2); fg.fill()
        }
      }

      if (m.on) {
        const g = fg.createRadialGradient(m.x, m.y, 0, m.x, m.y, 120)
        g.addColorStop(0, 'rgba(109,90,205,0.04)')
        g.addColorStop(.3, 'rgba(90,75,180,0.02)')
        g.addColorStop(1, 'transparent')
        fg.fillStyle = g; fg.beginPath(); fg.arc(m.x, m.y, 120, 0, Math.PI * 2); fg.fill()
      }

      animId = requestAnimationFrame(drawFg)
    }

    function handleMove(e: MouseEvent) {
      const rect = bgCanvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, on: true }
    }
    function handleLeave() { mouseRef.current.on = false }

    const parent = bgCanvas.parentElement!
    parent.addEventListener('mousemove', handleMove)
    parent.addEventListener('mouseleave', handleLeave)

    resize()
    animId = requestAnimationFrame(drawFg)

    const resizeHandler = () => resize()
    window.addEventListener('resize', resizeHandler)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resizeHandler)
      parent.removeEventListener('mousemove', handleMove)
      parent.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <>
      <canvas ref={bgRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={fgRef} className="absolute inset-0 w-full h-full z-[3]" />
    </>
  )
}
```

- [ ] **Step 3: Create hero overlay with Framer Motion**

Create `components/hero/hero-overlay.tsx`:
```tsx
'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function HeroOverlay() {
  const router = useRouter()

  function enterStore() {
    router.push('/store')
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    >
      <motion.h1
        className="font-display text-[54px] tracking-[12px] uppercase text-bone"
        style={{ textShadow: '0 0 60px rgba(109,90,205,.3), 0 2px 30px rgba(0,0,0,.5)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Cult of Elysium
      </motion.h1>
      <motion.button
        onClick={enterStore}
        className="mt-7 font-body font-light text-xs tracking-[6px] uppercase text-celestine/70 hover:text-celestine transition-colors cursor-pointer bg-transparent border-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        join the cult
      </motion.button>
    </motion.div>
  )
}
```

- [ ] **Step 4: Create homepage**

Create `app/(marketing)/page.tsx`:
```tsx
import { HeroCanvas } from '@/components/hero/hero-canvas'
import { HeroOverlay } from '@/components/hero/hero-overlay'

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#08070e]">
      <HeroCanvas />
      <HeroOverlay />
    </div>
  )
}
```

- [ ] **Step 5: Verify homepage**

```bash
npm run dev
```

Open `http://localhost:3000` — should show the full-screen hero with painted nebula background, animated orbs, twinkling stars, "CULT OF ELYSIUM" title, and "join the cult" button. Click "join the cult" should navigate to `/store`.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: homepage hero — painted nebula canvas + animated orbs + twinkling stars"
```

---

## Task 7: Product Detail Page

**Files:**
- Create: `app/(store)/products/[handle]/page.tsx`
- Create: `components/product/product-gallery.tsx`
- Create: `components/product/product-info.tsx`
- Create: `components/product/product-narrative.tsx`
- Create: `components/product/variant-selector.tsx`

- [ ] **Step 1: Create variant selector**

Create `components/product/variant-selector.tsx`:
```tsx
'use client'

import type { ProductVariant } from '@/lib/shopify/types'

type Props = {
  variants: ProductVariant[]
  selected: ProductVariant
  onSelect: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, selected, onSelect }: Props) {
  // Group by option name
  const options = new Map<string, { value: string; variant: ProductVariant }[]>()
  for (const v of variants) {
    for (const opt of v.selectedOptions) {
      if (!options.has(opt.name)) options.set(opt.name, [])
      const list = options.get(opt.name)!
      if (!list.find(o => o.value === opt.value)) {
        list.push({ value: opt.value, variant: v })
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {Array.from(options.entries()).map(([name, values]) => (
        <div key={name}>
          <p className="text-[10px] tracking-[3px] uppercase text-muted mb-3">{name}</p>
          <div className="flex gap-3">
            {values.map(({ value, variant }) => {
              const isActive = selected.id === variant.id
              return (
                <button
                  key={value}
                  onClick={() => onSelect(variant)}
                  className={`px-4 py-2 text-xs tracking-wide border transition-all cursor-pointer bg-transparent font-body ${
                    isActive
                      ? 'border-ritual-violet/60 text-celestine'
                      : 'border-white/10 text-muted hover:border-white/30'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create product gallery**

Create `components/product/product-gallery.tsx`:
```tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Image as ShopifyImage } from '@/lib/shopify/types'

export function ProductGallery({ images }: { images: ShopifyImage[] }) {
  const [active, setActive] = useState(0)

  if (!images.length) return <div className="aspect-[4/5] bg-crypt rounded-lg" />

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-crypt">
        <Image
          src={images[active].url}
          alt={images[active].altText ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              className={`aspect-square relative overflow-hidden rounded bg-crypt border transition-colors cursor-pointer ${
                i === active ? 'border-ritual-violet/50' : 'border-white/[0.06] hover:border-white/20'
              }`}
            >
              <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create product info**

Create `components/product/product-info.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { VariantSelector } from './variant-selector'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/shopify/types'

export function ProductInfo({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.variants[0])
  const { add, isPending } = useCart()
  const collection = product.collections?.[0]

  return (
    <div className="flex flex-col gap-5">
      {collection && (
        <p className="text-[10px] tracking-[4px] uppercase text-ritual-violet font-medium">
          {collection.title}
        </p>
      )}
      <h1 className="font-display text-3xl tracking-wide text-bone leading-tight">{product.title}</h1>
      <p className="text-xl text-silver-relic font-light">{formatPrice(selected.price)}</p>

      {product.variants.length > 1 && (
        <VariantSelector variants={product.variants} selected={selected} onSelect={setSelected} />
      )}

      <div className="flex flex-col gap-3 mt-2">
        <Button variant="primary" onClick={() => add(selected.id)} disabled={isPending || !selected.availableForSale}>
          {!selected.availableForSale ? 'Sold Out' : isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create product narrative**

Create `components/product/product-narrative.tsx`:
```tsx
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
```

- [ ] **Step 5: Create product page**

Create `app/(store)/products/[handle]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify/queries'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ProductNarrative } from '@/components/product/product-narrative'

export const revalidate = 300

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      <div className="mt-16 max-w-2xl">
        <ProductNarrative product={product} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: product detail page — gallery, variant selector, narrative, add-to-cart"
```

---

## Task 8: Collection & Search Pages

**Files:**
- Create: `app/(store)/collections/page.tsx`
- Create: `app/(store)/collections/[handle]/page.tsx`
- Create: `app/(store)/search/page.tsx`

- [ ] **Step 1: All collections page**

Create `app/(store)/collections/page.tsx`:
```tsx
import { getCollections } from '@/lib/shopify/queries'
import { CollectionRow } from '@/components/store/collection-row'

export const revalidate = 300

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone mb-12">Collections</h1>
      <CollectionRow collections={collections} />
    </div>
  )
}
```

- [ ] **Step 2: Single collection page**

Create `app/(store)/collections/[handle]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'

export const revalidate = 300

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone">{collection.title}</h1>
        {collection.description && (
          <p className="text-sm text-muted mt-4 max-w-xl">{collection.description}</p>
        )}
      </div>
      <ProductGrid products={collection.products} />
    </div>
  )
}
```

- [ ] **Step 3: Search page**

Create `app/(store)/search/page.tsx`:
```tsx
import { searchProducts } from '@/lib/shopify/queries'
import { ProductGrid } from '@/components/store/product-grid'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const products = q ? await searchProducts(q) : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl tracking-[4px] uppercase text-bone mb-4">Search</h1>
      {q && (
        <p className="text-sm text-muted mb-12">
          {products.length} results for &ldquo;{q}&rdquo;
        </p>
      )}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : q ? (
        <p className="text-muted text-center py-20">No products found</p>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: collection pages + search page"
```

---

## Task 9: About Page & Revalidation Webhook

**Files:**
- Create: `app/(marketing)/about/page.tsx`
- Create: `app/api/revalidate/route.ts`

- [ ] **Step 1: About page**

Create `app/(marketing)/about/page.tsx`:
```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-void">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-3xl tracking-[6px] uppercase text-bone mb-8">The Cult</h1>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Cult of Elysium is an offering from the night itself — sacred jewelry for those who wear darkness as devotion.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-10">
          Each piece is a relic, forged with intention and gifted from a place beyond the mortal veil.
        </p>
        <Link href="/store">
          <Button variant="ritual">Enter the Store</Button>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Revalidation webhook**

Create `app/api/revalidate/route.ts`:
```typescript
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.SHOPIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('products')
  revalidateTag('collections')

  return NextResponse.json({ revalidated: true })
}
```

Add `SHOPIFY_WEBHOOK_SECRET=your-secret-here` to `.env.local`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: about page + Shopify revalidation webhook"
```

---

## Task 10: Final Polish & Verification

- [ ] **Step 1: Add loading states**

Create `app/(store)/loading.tsx`:
```tsx
import { Skeleton } from '@/components/ui/loading-skeleton'

export default function StoreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Skeleton className="h-8 w-48 mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <Skeleton className="h-3 w-20 mt-4" />
            <Skeleton className="h-5 w-40 mt-2" />
            <Skeleton className="h-4 w-16 mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add not-found page**

Create `app/not-found.tsx`:
```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-[6px] uppercase text-bone mb-4">Lost in the Void</h1>
        <p className="text-muted text-sm mb-10">This page does not exist in any realm.</p>
        <Link href="/"><Button variant="ritual">Return Home</Button></Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run full build**

```bash
npm run build
```

Fix any TypeScript or build errors.

- [ ] **Step 4: Start production server and verify all routes**

```bash
npm run start
```

Verify:
- `http://localhost:3000` — Hero animation, "join the cult" navigates to store
- `http://localhost:3000/store` — Product grid (needs Shopify token for data)
- `http://localhost:3000/collections` — Collections page
- `http://localhost:3000/about` — About page
- `http://localhost:3000/nonexistent` — 404 page
- Mobile responsive — navbar, product grid, product detail all work on small screens

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: loading states, 404 page, build verification"
```

---

## Post-Implementation Notes

**Before launch, you'll need:**
1. Shopify Storefront API access token in `.env.local`
2. Shopify webhook pointing to `/api/revalidate` for product updates
3. Vercel deployment (`vercel deploy`) — configure env vars in Vercel dashboard
4. Judge.me review integration (Task for later — requires their API)
5. Real product images from Shopify CDN will replace the empty states
