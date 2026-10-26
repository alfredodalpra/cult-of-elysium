// Generates the mock catalogue's product photos with Gemini image generation.
//
//   node scripts/generate-product-images.mjs            # generate missing images
//   node scripts/generate-product-images.mjs --force    # regenerate all
//   node scripts/generate-product-images.mjs --only=1,13
//
// Needs GEMINI_API_KEY in .env.local. Writes public/images/products/coe-<id>.webp,
// matching the ids used by img() in lib/shopify/mock-data.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const MODEL = 'gemini-3-pro-image'
const OUT_DIR = path.join(process.cwd(), 'public/images/products')
const SIZE = { width: 900, height: 1200 }

const STYLE = [
  'Luxury e-commerce product photograph for a gothic celestial jewelry brand.',
  'Vertical 3:4 composition, the piece centered with generous margins.',
  'Dark moody studio: near-black background with a subtle deep-violet haze, a soft overhead spotlight,',
  'faint out-of-focus specks of light like distant stars. The piece rests on black velvet.',
  'Realistic metal reflections, crisp macro detail, shallow depth of field, high-end catalogue quality.',
  'No text, no logos, no watermark, no hands, no people, no props other than the velvet.',
].join(' ')

// `ref` points at another image id whose output is sent along as a visual reference,
// so colour variants and detail shots match the main photo.
const IMAGES = [
  { id: 1, prompt: 'A heavy stainless steel chain bracelet laid in a loose oval: alternating bezel-set faceted rose-pink glass gemstones and small polished pyramid spike drops, like stained glass reassembled into a relic. Adjustable chain with a lobster clasp.' },
  { id: 11, ref: 1, prompt: 'The exact same bracelet as the reference image, same composition, camera angle and lighting, but every gemstone is a deep verdigris green (patinated copper green).' },
  { id: 12, ref: 1, prompt: 'The exact same bracelet as the reference image, same composition, camera angle and lighting, but every gemstone is a pale celestine lavender-blue.' },
  { id: 13, ref: 1, prompt: 'A macro close-up detail of the bracelet in the reference image: two rose-pink faceted gemstones and the steel spike between them, showing the chain links and facets.' },

  { id: 2, prompt: 'A necklace with layered fine steel chains cascading to a central crown-shaped pendant, black rhodium plated, set with small midnight-blue and violet crystals, a tiny star above the crown.' },
  { id: 21, ref: 2, prompt: 'A macro close-up of the crown pendant from the reference image, showing the midnight-blue crystals and the black rhodium finish.' },
  { id: 22, ref: 2, prompt: 'The necklace from the reference image displayed on a black velvet jewelry bust, seen slightly from the side.' },

  { id: 3, prompt: 'A set of three interlocking stainless steel rings with an antique, slightly darkened finish, linked together like a vow, lying on velvet.' },
  { id: 31, ref: 3, prompt: 'The three rings from the reference image stacked together on one finger-shaped black velvet ring display.' },

  { id: 4, prompt: 'A black-plated stainless steel choker necklace: a close-fitting veil of fine black chain with small polished obsidian teardrop pendants hanging along the front.' },
  { id: 41, ref: 4, prompt: 'A macro close-up of the obsidian teardrop drops and black chain from the choker in the reference image.' },

  { id: 5, prompt: 'A pair of antique-silver stud earrings shaped as serpents coiling upward, each serpent head resting at the post with tiny clear crystal eyes.' },

  { id: 6, prompt: 'A pendant necklace: a single polished black obsidian stone in the shape of a teardrop hanging from a delicate sterling silver chain, reflecting light like a dark mirror.' },
  { id: 61, ref: 6, prompt: 'A macro close-up of the obsidian teardrop pendant from the reference image, showing its glossy mirror-like surface and the silver bail.' },

  { id: 7, prompt: 'A single plain matte black titanium ring standing upright, its polished inner edge catching a thin bright rim of light like the corona of a solar eclipse.' },

  { id: 8, prompt: 'An open cuff bracelet made of twisted steel vines with small sharp thorns, brushed stainless steel finish.' },
  { id: 81, ref: 8, prompt: 'An extreme macro close-up of the cuff bracelet in the reference image, filling the frame: only one end of the cuff is visible, showing the twisted steel strands and individual sharp thorns in fine detail, brushed metal texture visible.' },
]

function readApiKey() {
  const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : ''
  const key = process.env.GEMINI_API_KEY ?? env.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim()
  if (!key) throw new Error('GEMINI_API_KEY is not set (add it to .env.local)')
  return key
}

async function generate(key, prompt, reference) {
  const parts = [{ text: `${STYLE}\n\n${prompt}` }]
  if (reference) parts.push({ inlineData: { mimeType: 'image/png', data: reference.toString('base64') } })

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '3:4' } },
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`${res.status} ${json.error?.message ?? JSON.stringify(json)}`)

  const image = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData
  if (!image) throw new Error(`no image returned (finishReason: ${json.candidates?.[0]?.finishReason ?? 'unknown'})`)
  return Buffer.from(image.data, 'base64')
}

async function main() {
  const key = readApiKey()
  const force = process.argv.includes('--force')
  const only = process.argv.find(a => a.startsWith('--only='))?.slice(7).split(',').map(Number)
  mkdirSync(OUT_DIR, { recursive: true })

  const outPath = id => path.join(OUT_DIR, `coe-${id}.webp`)
  const todo = IMAGES.filter(img => (only ? only.includes(img.id) : force || !existsSync(outPath(img.id))))

  // Main shots first, so their output can be used as references.
  for (const pass of [todo.filter(i => !i.ref), todo.filter(i => i.ref)]) {
    await Promise.all(pass.map(async img => {
      try {
        const reference = img.ref ? await sharp(outPath(img.ref)).png().toBuffer() : undefined
        const raw = await generate(key, img.prompt, reference)
        const webp = await sharp(raw).resize(SIZE.width, SIZE.height, { fit: 'cover' }).webp({ quality: 82 }).toBuffer()
        writeFileSync(outPath(img.id), webp)
        console.log(`ok   coe-${img.id}.webp (${Math.round(webp.length / 1024)} KB)`)
      } catch (err) {
        console.error(`FAIL coe-${img.id}: ${err.message}`)
        process.exitCode = 1
      }
    }))
  }
}

main()
