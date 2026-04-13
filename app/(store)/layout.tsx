import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { StarField } from '@/components/ui/star-field'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0914] via-void to-void" />
        <StarField />
      </div>
      <div className="relative z-10">
        <Navbar />
        <CartDrawer />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
