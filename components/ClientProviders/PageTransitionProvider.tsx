'use client'

import { motion } from 'framer-motion'

export const pageTransition = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { ease: 'easeInOut', duration: 0.75 },
}

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}
