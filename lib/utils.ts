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
