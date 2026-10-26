import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Shopify signs each webhook with an HMAC-SHA256 of the raw request body,
// base64-encoded in the X-Shopify-Hmac-Sha256 header.
function isValidShopifyWebhook(body: string, signature: string | null, secret: string | undefined) {
  if (!signature || !secret) return false
  const expected = createHmac('sha256', secret).update(body, 'utf8').digest()
  const received = Buffer.from(signature, 'base64')
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-shopify-hmac-sha256')

  if (!isValidShopifyWebhook(body, signature, process.env.SHOPIFY_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('products', 'default')
  revalidateTag('collections', 'default')

  return NextResponse.json({ revalidated: true })
}
