import type { Product, Collection } from './types'

// Product photos generated with scripts/generate-product-images.mjs
const img = (id: number) => ({
  url: `/images/products/coe-${id}.webp`,
  altText: null,
  width: 900,
  height: 1200,
})

const money = (amount: string) => ({ amount, currencyCode: 'EUR' })

export const mockProducts: Product[] = [
  {
    id: 'mock-1', handle: 'chapelbind-bracelet', title: 'The Chapelbind Bracelet',
    description: 'An offering — a heavy, glittering relic for wrists that bear sacred weight.',
    descriptionHtml: '<p>An offering — a heavy, glittering relic for wrists that bear sacred weight. Inspired by altarwear and gothic symbolism, this bracelet wraps you with gleaming gems and alternating spike drops, like stained glass shattered and reassembled into devotion.</p><ul><li>Stainless steel (hypoallergenic, tarnish-resistant)</li><li>Alternating gemstone and spike chain pattern</li><li>Adjustable chain with clasp</li></ul>',
    availableForSale: true, tags: ['bracelet', 'relic'],
    featuredImage: img(1), images: [img(1), img(11), img(12), img(13)],
    variants: [
      { id: 'v1a', title: 'Roseglass', availableForSale: true, price: money('42.00'), compareAtPrice: null, selectedOptions: [{ name: 'Color', value: 'Roseglass' }], image: img(1) },
      { id: 'v1b', title: 'Verdegris', availableForSale: true, price: money('42.00'), compareAtPrice: null, selectedOptions: [{ name: 'Color', value: 'Verdegris' }], image: img(11) },
      { id: 'v1c', title: 'Celestine', availableForSale: true, price: money('42.00'), compareAtPrice: null, selectedOptions: [{ name: 'Color', value: 'Celestine' }], image: img(12) },
    ],
    priceRange: { minVariantPrice: money('42.00'), maxVariantPrice: money('42.00') },
    collections: [{ handle: 'the-relic-collection', title: 'The Relic Collection' }],
  },
  {
    id: 'mock-2', handle: 'astral-crown-necklace', title: 'Astral Crown Necklace',
    description: 'A celestial coronation for the throat — star-forged and eternal.',
    descriptionHtml: '<p>A celestial coronation for the throat — star-forged and eternal. Layered chains cascade from a central crown pendant set with midnight stones.</p><ul><li>Stainless steel with black rhodium plating</li><li>Central crown pendant with embedded crystals</li><li>Lobster clasp with extender</li></ul>',
    availableForSale: true, tags: ['necklace', 'star-vault'],
    featuredImage: img(2), images: [img(2), img(21), img(22)],
    variants: [
      { id: 'v2a', title: 'Default', availableForSale: true, price: money('38.00'), compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Default' }], image: img(2) },
    ],
    priceRange: { minVariantPrice: money('38.00'), maxVariantPrice: money('38.00') },
    collections: [{ handle: 'the-star-vault', title: 'The Star Vault' }],
  },
  {
    id: 'mock-3', handle: 'vow-ring-set', title: 'Vow Ring Set',
    description: 'Three bands bound together — a sacred promise worn on the hand.',
    descriptionHtml: '<p>Three bands bound together — a sacred promise worn on the hand. Each ring interlocks with the next, forming a single devotion when united.</p><ul><li>Set of 3 interlocking rings</li><li>Stainless steel with antique finish</li><li>Available in sizes 5-10</li></ul>',
    availableForSale: true, tags: ['ring', 'binding-rite'],
    featuredImage: img(3), images: [img(3), img(31)],
    variants: [
      { id: 'v3a', title: 'Size 6', availableForSale: true, price: money('29.00'), compareAtPrice: null, selectedOptions: [{ name: 'Size', value: '6' }], image: img(3) },
      { id: 'v3b', title: 'Size 7', availableForSale: true, price: money('29.00'), compareAtPrice: null, selectedOptions: [{ name: 'Size', value: '7' }], image: img(3) },
      { id: 'v3c', title: 'Size 8', availableForSale: true, price: money('29.00'), compareAtPrice: null, selectedOptions: [{ name: 'Size', value: '8' }], image: img(3) },
    ],
    priceRange: { minVariantPrice: money('29.00'), maxVariantPrice: money('29.00') },
    collections: [{ handle: 'the-binding-rite', title: 'The Binding Rite' }],
  },
  {
    id: 'mock-4', handle: 'nightveil-choker', title: 'Nightveil Choker',
    description: 'Darkness draped around the neck — a veil of black chain and obsidian.',
    descriptionHtml: '<p>Darkness draped around the neck — a veil of black chain and obsidian drops. Sits close to the skin like a whispered oath.</p><ul><li>Black-plated stainless steel</li><li>Obsidian drop pendants</li><li>Adjustable 14-16 inches</li></ul>',
    availableForSale: true, tags: ['necklace', 'relic'],
    featuredImage: img(4), images: [img(4), img(41)],
    variants: [
      { id: 'v4a', title: 'Default', availableForSale: true, price: money('55.00'), compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Default' }], image: img(4) },
    ],
    priceRange: { minVariantPrice: money('55.00'), maxVariantPrice: money('55.00') },
    collections: [{ handle: 'the-relic-collection', title: 'The Relic Collection' }],
  },
  {
    id: 'mock-5', handle: 'serpent-coil-earrings', title: 'Serpent Coil Earrings',
    description: 'Serpents ascending the ear — ancient guardians in miniature.',
    descriptionHtml: '<p>Serpents ascending the ear — ancient guardians in miniature. Each earring coils upward, the serpent\'s head resting at the lobe with tiny gem eyes.</p><ul><li>Stainless steel with antique silver finish</li><li>Tiny crystal eyes</li><li>Post-back closure</li></ul>',
    availableForSale: true, tags: ['earring', 'star-vault'],
    featuredImage: img(5), images: [img(5)],
    variants: [
      { id: 'v5a', title: 'Default', availableForSale: true, price: money('24.00'), compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Default' }], image: img(5) },
    ],
    priceRange: { minVariantPrice: money('24.00'), maxVariantPrice: money('24.00') },
    collections: [{ handle: 'the-star-vault', title: 'The Star Vault' }],
  },
  {
    id: 'mock-6', handle: 'obsidian-tear-pendant', title: 'Obsidian Tear Pendant',
    description: 'A single black tear — grief made beautiful, worn close to the heart.',
    descriptionHtml: '<p>A single black tear — grief made beautiful, worn close to the heart. A polished obsidian drop hangs from a delicate chain, catching light like a dark mirror.</p><ul><li>Natural obsidian stone</li><li>Sterling silver chain</li><li>18-inch chain with 2-inch extender</li></ul>',
    availableForSale: true, tags: ['necklace', 'binding-rite'],
    featuredImage: img(6), images: [img(6), img(61)],
    variants: [
      { id: 'v6a', title: 'Default', availableForSale: true, price: money('46.00'), compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Default' }], image: img(6) },
    ],
    priceRange: { minVariantPrice: money('46.00'), maxVariantPrice: money('46.00') },
    collections: [{ handle: 'the-binding-rite', title: 'The Binding Rite' }],
  },
  {
    id: 'mock-7', handle: 'eclipse-band', title: 'Eclipse Band',
    description: 'A ring forged in the shadow of a dying star — simple, eternal, dark.',
    descriptionHtml: '<p>A ring forged in the shadow of a dying star — simple, eternal, dark. The matte black band catches a sliver of light at the edge, like the corona of an eclipse.</p><ul><li>Black titanium</li><li>Polished inner edge</li><li>Comfort fit</li></ul>',
    availableForSale: true, tags: ['ring', 'relic'],
    featuredImage: img(7), images: [img(7)],
    variants: [
      { id: 'v7a', title: 'Size 7', availableForSale: true, price: money('32.00'), compareAtPrice: null, selectedOptions: [{ name: 'Size', value: '7' }], image: img(7) },
      { id: 'v7b', title: 'Size 8', availableForSale: true, price: money('32.00'), compareAtPrice: null, selectedOptions: [{ name: 'Size', value: '8' }], image: img(7) },
    ],
    priceRange: { minVariantPrice: money('32.00'), maxVariantPrice: money('32.00') },
    collections: [{ handle: 'the-relic-collection', title: 'The Relic Collection' }],
  },
  {
    id: 'mock-8', handle: 'thorned-grace-cuff', title: 'Thorned Grace Cuff',
    description: 'Beauty protected by thorns — an open cuff that commands respect.',
    descriptionHtml: '<p>Beauty protected by thorns — an open cuff that commands respect. Twisted vines of steel wrap the wrist, each thorn a small act of defiance.</p><ul><li>Stainless steel with brushed finish</li><li>Open cuff design — adjustable</li><li>Medium weight</li></ul>',
    availableForSale: true, tags: ['bracelet', 'star-vault'],
    featuredImage: img(8), images: [img(8), img(81)],
    variants: [
      { id: 'v8a', title: 'Default', availableForSale: true, price: money('48.00'), compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Default' }], image: img(8) },
    ],
    priceRange: { minVariantPrice: money('48.00'), maxVariantPrice: money('48.00') },
    collections: [{ handle: 'the-star-vault', title: 'The Star Vault' }],
  },
]

const collectionImg = (handle: string, title: string) => ({
  url: `/images/collections/${handle}.webp`,
  altText: `${title} jewelry arranged on black velvet`,
  width: 1600,
  height: 900,
})

export const mockCollections: Collection[] = [
  {
    id: 'col-1', handle: 'the-relic-collection', title: 'The Relic Collection',
    description: 'Altarwear and gothic symbolism — heavy, glittering relics for sacred devotion.',
    image: collectionImg('the-relic-collection', 'The Relic Collection'),
    products: mockProducts.filter(p => p.collections.some(c => c.handle === 'the-relic-collection')),
  },
  {
    id: 'col-2', handle: 'the-star-vault', title: 'The Star Vault',
    description: 'Celestial offerings from the cosmos — astral crowns, lunar pendants, starborn rings.',
    image: collectionImg('the-star-vault', 'The Star Vault'),
    products: mockProducts.filter(p => p.collections.some(c => c.handle === 'the-star-vault')),
  },
  {
    id: 'col-3', handle: 'the-binding-rite', title: 'The Binding Rite',
    description: 'Vows forged in darkness — rings, bands, and bonds for the devoted.',
    image: collectionImg('the-binding-rite', 'The Binding Rite'),
    products: mockProducts.filter(p => p.collections.some(c => c.handle === 'the-binding-rite')),
  },
]
