'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function HeroOverlay() {
  const router = useRouter()

  function enterStore() {
    router.push('/store')
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    >
      <motion.h1
        className="font-display text-[30px] tracking-[6px] sm:text-[54px] sm:tracking-[12px] uppercase text-bone text-center px-6"
        style={{ textShadow: '0 0 60px rgba(109,90,205,.3), 0 2px 30px rgba(0,0,0,.5)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Cult of Elysium
      </motion.h1>
      <motion.button
        onClick={enterStore}
        className="mt-5 px-4 py-3 font-body font-light text-xs tracking-[6px] uppercase text-celestine/70 hover:text-celestine transition-colors cursor-pointer bg-transparent border-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        join the cult
      </motion.button>
    </motion.div>
  )
}
