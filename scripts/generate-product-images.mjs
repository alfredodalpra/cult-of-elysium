// Generates the mock catalogue's product and collection photos with Gemini image generation.
//
//   node scripts/generate-product-images.mjs                    # generate missing images
//   node scripts/generate-product-images.mjs --force            # regenerate all
//   node scripts/generate-product-images.mjs --only=1,13,the-star-vault
//
// Needs GEMINI_API_KEY in .env.local. Writes public/images/products/coe-<id>.webp
// (the ids used by img() in lib/shopify/mock-data.ts) and
// public/images/collections/<handle>.webp.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const MODEL = 'gemini-3-pro-image'
const PRODUCT_DIR = path.join(process.cwd(), 'public/images/products')
const COLLECTION_DIR = path.join(process.cwd(), 'public/images/collections')

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
const PRODUCTS = [
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

// Collection banners (16:9). The card overlays its title on the bottom-left, so that
// area is kept dark and empty. `refs` are product ids whose main photos are passed in
// so the banner shows the collection's actual pieces.
const COLLECTIONS = [
  {
    handle: 'the-relic-collection',
    refs: [1, 4, 7],
    prompt: 'A wide still-life of the jewelry pieces shown in the reference images (the gem-and-spike bracelet, the black choker with obsidian drops, the black ring) arranged on black velvet beside a gothic stone altar ledge with a melted candle, like sacred relics.',
  },
  {
    handle: 'the-star-vault',
    refs: [2, 5, 8],
    prompt: 'A wide still-life of the jewelry pieces shown in the reference images (the crown pendant necklace, the serpent earrings, the thorned cuff) on black velvet under a deep night sky full of stars and a faint violet nebula, like treasures in a celestial vault.',
  },
  {
    handle: 'the-binding-rite',
    refs: [3, 6],
    prompt: 'A wide still-life of the jewelry pieces shown in the reference images (the three interlocking rings, the obsidian teardrop pendant) on black velvet, bound loosely with a thin dark silk ribbon, candlelit, intimate and solemn like a vow ceremony.',
  },
]

const COLLECTION_FRAMING =
  'Wide 16:9 banner: one single continuous photograph filling the entire frame edge to edge, ' +
  'no borders, no side panels, no collage. Keep the pieces in the upper and right part of the frame; ' +
  'the bottom-left third must be dark, plain and uncluttered because text is overlaid there.'

// One flat list of jobs; `refs` name other jobs whose output is used as a reference.
const JOBS = [
  ...PRODUCTS.map(p => ({
    name: `coe-${p.id}`,
    keys: [String(p.id)],
    prompt: p.prompt,
    refs: p.ref ? [`coe-${p.ref}`] : [],
    aspect: '3:4',
    size: { width: 900, height: 1200 },
    file: path.join(PRODUCT_DIR, `coe-${p.id}.webp`),
  })),
  ...COLLECTIONS.map(c => ({
    name: c.handle,
    keys: [c.handle],
    prompt: `${c.prompt}
${COLLECTION_FRAMING}`,
    refs: c.refs.map(id => `coe-${id}`),
    aspect: '16:9',
    size: { width: 1600, height: 900 },
    file: path.join(COLLECTION_DIR, `${c.handle}.webp`),
  })),
]

function readApiKey() {
  const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : ''
  // Accept dotenv-style values: optional quotes, optional trailing comment.
  const fromFile = env.match(/^GEMINI_API_KEY=\s*(?:"([^"]*)"|'([^']*)'|([^\s#]*))/m)
  const key = process.env.GEMINI_API_KEY ?? fromFile?.slice(1).find(v => v !== undefined)
  if (!key) throw new Error('GEMINI_API_KEY is not set (add it to .env.local)')
  return key
}

const CONCURRENCY = 3
const MAX_ATTEMPTS = 4

// Runs `fn` over `items` with at most `limit` in flight.
async function mapLimit(items, limit, fn) {
  const queue = [...items]
  await Promise.all(Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift())
  }))
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generate(key, prompt, aspect, references) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await requestImage(key, prompt, aspect, references)
    } catch (err) {
      // Retry rate limits, overloads and the occasional empty (NO_IMAGE) response.
      if (!err.retryable || attempt >= MAX_ATTEMPTS) throw err
      const delay = 2000 * 2 ** (attempt - 1)
      console.warn(`     retrying in ${delay / 1000}s (${err.message})`)
      await sleep(delay)
    }
  }
}

function retryable(message) {
  return Object.assign(new Error(message), { retryable: true })
}

async function requestImage(key, prompt, aspect, references) {
  const parts = [{ text: `${STYLE}

${prompt}` }]
  for (const ref of references) parts.push({ inlineData: { mimeType: 'image/png', data: ref.toString('base64') } })

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: aspect } },
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    const message = `${res.status} ${json.error?.message ?? JSON.stringify(json)}`
    throw res.status === 429 || res.status >= 500 ? retryable(message) : new Error(message)
  }

  const image = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData
  if (!image) throw retryable(`no image returned (finishReason: ${json.candidates?.[0]?.finishReason ?? 'unknown'})`)
  return Buffer.from(image.data, 'base64')
}

async function main() {
  const key = readApiKey()
  const force = process.argv.includes('--force')
  const only = process.argv.find(a => a.startsWith('--only='))?.slice(7).split(',')
  mkdirSync(PRODUCT_DIR, { recursive: true })
  mkdirSync(COLLECTION_DIR, { recursive: true })

  const byName = new Map(JOBS.map(j => [j.name, j]))
  const todo = JOBS.filter(j => (only ? j.keys.some(k => only.includes(k)) : force || !existsSync(j.file)))

  const failed = new Set()

  // Jobs without references first, so their output can be used by the rest.
  for (const pass of [todo.filter(j => !j.refs.length), todo.filter(j => j.refs.length)]) {
    await mapLimit(pass, CONCURRENCY, async job => {
      try {
        // Don't build on a reference that failed this run (an old file would no longer match)
        // or that was never generated.
        for (const ref of job.refs) {
          if (failed.has(ref)) throw new Error(`reference ${ref} failed to generate`)
          if (!existsSync(byName.get(ref).file)) throw new Error(`reference ${ref} is missing; generate it first (--only=${byName.get(ref).keys[0]})`)
        }
        const references = await Promise.all(job.refs.map(r => sharp(byName.get(r).file).png().toBuffer()))
        const raw = await generate(key, job.prompt, job.aspect, references)
        const webp = await sharp(raw).resize(job.size.width, job.size.height, { fit: 'cover' }).webp({ quality: 82 }).toBuffer()
        writeFileSync(job.file, webp)
        console.log(`ok   ${path.relative(process.cwd(), job.file)} (${Math.round(webp.length / 1024)} KB)`)
      } catch (err) {
        failed.add(job.name)
        console.error(`FAIL ${job.name}: ${err.message}`)
        process.exitCode = 1
      }
    })
  }
}

main()
