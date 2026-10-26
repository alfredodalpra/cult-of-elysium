import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About',
  description: 'Cult of Elysium is sacred jewelry for those who wear darkness as devotion.',
}

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
