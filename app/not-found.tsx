import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-[6px] uppercase text-bone mb-4">Lost in the Void</h1>
        <p className="text-muted text-sm mb-10">This page does not exist in any realm.</p>
        <Link href="/"><Button variant="ritual">Return Home</Button></Link>
      </div>
    </div>
  )
}
