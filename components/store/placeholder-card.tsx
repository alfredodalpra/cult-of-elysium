'use client'

import { motion } from 'framer-motion'

const placeholders = [
  { name: 'The Chapelbind Bracelet', collection: 'The Relic Collection', price: '€42.00' },
  { name: 'Astral Crown Necklace', collection: 'The Star Vault', price: '€38.00' },
  { name: 'Vow Ring Set', collection: 'The Binding Rite', price: '€29.00' },
  { name: 'Nightveil Choker', collection: 'The Relic Collection', price: '€55.00' },
  { name: 'Serpent Coil Earrings', collection: 'The Star Vault', price: '€24.00' },
  { name: 'Obsidian Tear Pendant', collection: 'The Binding Rite', price: '€46.00' },
  { name: 'Eclipse Band', collection: 'The Relic Collection', price: '€32.00' },
  { name: 'Thorned Grace Cuff', collection: 'The Star Vault', price: '€48.00' },
]

export function PlaceholderGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {placeholders.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="group cursor-pointer"
        >
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500 bg-gradient-to-br from-deep-altar to-crypt">
            {/* Abstract jewelry silhouette */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700">
              <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="35" r="18" stroke="currentColor" strokeWidth=".5" className="text-ritual-violet" />
                <circle cx="50" cy="35" r="10" stroke="currentColor" strokeWidth=".3" className="text-ritual-violet" />
                <line x1="50" y1="53" x2="50" y2="85" stroke="currentColor" strokeWidth=".5" className="text-ritual-violet" />
                <line x1="38" y1="75" x2="62" y2="75" stroke="currentColor" strokeWidth=".4" className="text-ritual-violet" />
                <circle cx="50" cy="35" r="3" fill="currentColor" className="text-ritual-violet" opacity=".3" />
              </svg>
            </div>
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="mt-4">
            <p className="text-[9px] tracking-[3px] uppercase text-ritual-violet font-medium mb-1">
              {p.collection}
            </p>
            <h3 className="font-display text-base tracking-wide text-bone">{p.name}</h3>
            <p className="text-sm text-muted mt-1">{p.price}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
