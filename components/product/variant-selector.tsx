'use client'

import type { ProductVariant } from '@/lib/shopify/types'

type Props = {
  variants: ProductVariant[]
  selected: ProductVariant
  onSelect: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, selected, onSelect }: Props) {
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
