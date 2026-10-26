'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './cart-provider'
import { CartLineItem } from './cart-line-item'
import { Button, buttonClasses } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { cart, isOpen, close, isPending, error } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-deep-altar border-l border-white/[0.06] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-display text-lg tracking-[3px] uppercase">Cart</h2>
              <button onClick={close} className="text-muted hover:text-bone transition-colors text-sm cursor-pointer bg-transparent border-none">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {!cart?.lines.length ? (
                <p className="text-muted text-sm text-center py-12">Your cart is empty</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {cart.lines.map((item) => (
                    <CartLineItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
            {cart && cart.lines.length > 0 && (
              <div className="p-6 border-t border-white/[0.06]">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="text-sm">{formatPrice(cart.cost.subtotalAmount)}</span>
                </div>
                {cart.checkoutUrl && !isPending ? (
                  <a href={cart.checkoutUrl} className={buttonClasses('primary', 'w-full')}>
                    Checkout
                  </a>
                ) : cart.checkoutUrl ? (
                  // A real disabled button while quantities are updating, so checkout
                  // can't be opened (even from the keyboard) with stale quantities.
                  <Button variant="primary" className="w-full" disabled>
                    Updating...
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" className="w-full" disabled>
                      {isPending ? 'Updating...' : 'Checkout'}
                    </Button>
                    <p className="text-[10px] text-muted text-center mt-3 tracking-wide">
                      Demo store: checkout is disabled.
                    </p>
                  </>
                )}
              </div>
            )}
            {error && (
              <p role="alert" className="px-6 pb-6 text-xs text-center text-red-300">{error}</p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
