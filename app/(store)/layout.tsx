import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { StarField } from '@/components/ui/star-field'
import { getCollections } from '@/lib/shopify/queries'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  // The navbar's Shop menu lists the real collections, so it can't link to ones that don't exist.
  const collections = (await getCollections()).map(({ handle, title }) => ({ handle, title }))

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0914] via-void to-void" />
        <StarField />
      </div>
      <div className="relative z-10">
        <Navbar collections={collections} />
        <CartDrawer />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
