'use client'

import { motion } from 'framer-motion'
import { pageTransition } from '@/components/ClientProviders/PageTransitionProvider'

export default function Template({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}
