'use client'

import { motion } from 'framer-motion'

const pageTransition = {
  initial: { x: 10, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3 },
}

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}
