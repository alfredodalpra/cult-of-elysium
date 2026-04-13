import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.SHOPIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('products', 'default')
  revalidateTag('collections', 'default')

  return NextResponse.json({ revalidated: true })
}
