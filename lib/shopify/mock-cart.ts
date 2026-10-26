import { mockProducts } from './mock-data'
import type { Cart, CartItem } from './types'

// Demo-mode cart. Only variant ids and quantities are persisted (in a cookie);
// the full cart is rebuilt from mock product data on every read.

export type MockLine = { variantId: string; quantity: number }

export function parseMockLines(raw: string | undefined): MockLine[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is MockLine =>
        typeof l?.variantId === 'string' && Number.isInteger(l?.quantity) && l.quantity > 0,
    )
  } catch {
    return []
  }
}

export function addMockLine(lines: MockLine[], variantId: string, quantity: number): MockLine[] {
  const existing = lines.find(l => l.variantId === variantId)
  if (!existing) return [...lines, { variantId, quantity }]
  return lines.map(l => (l.variantId === variantId ? { ...l, quantity: l.quantity + quantity } : l))
}

export function updateMockLine(lines: MockLine[], variantId: string, quantity: number): MockLine[] {
  if (quantity <= 0) return lines.filter(l => l.variantId !== variantId)
  return lines.map(l => (l.variantId === variantId ? { ...l, quantity } : l))
}

export function removeMockLines(lines: MockLine[], variantIds: string[]): MockLine[] {
  return lines.filter(l => !variantIds.includes(l.variantId))
}

export function buildMockCart(lines: MockLine[]): Cart {
  const items: CartItem[] = []
  for (const line of lines) {
    const product = mockProducts.find(p => p.variants.some(v => v.id === line.variantId))
    const variant = product?.variants.find(v => v.id === line.variantId)
    if (!product || !variant) continue
    items.push({
      // In demo mode the line id is the variant id, since each variant appears once.
      id: variant.id,
      quantity: line.quantity,
      merchandise: {
        id: variant.id,
        title: variant.title,
        product: { title: product.title, handle: product.handle, featuredImage: product.featuredImage },
        price: variant.price,
        selectedOptions: variant.selectedOptions,
        image: variant.image,
      },
    })
  }

  const currencyCode = items[0]?.merchandise.price.currencyCode ?? 'EUR'
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.merchandise.price.amount) * i.quantity, 0)
  const total = { amount: subtotal.toFixed(2), currencyCode }

  return {
    id: 'mock-cart',
    // Empty checkout URL tells the UI there is no real checkout to send the user to.
    checkoutUrl: '',
    totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
    cost: { subtotalAmount: total, totalAmount: total, totalTaxAmount: null },
    lines: items,
  }
}
