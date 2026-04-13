import { HeroCanvas } from '@/components/hero/hero-canvas'
import { HeroOverlay } from '@/components/hero/hero-overlay'

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#08070e]">
      <HeroCanvas />
      <HeroOverlay />
    </div>
  )
}
