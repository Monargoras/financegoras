'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
import { DatesProvider } from '@mantine/dates'
import { SWRConfig } from 'swr'
import { motion } from 'framer-motion'

export default function ClientProviders({
  session,
  language,
  children,
}: {
  session: Session | null | undefined
  language: string
  children: React.ReactNode
}) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <motion.main
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: 'easeInOut', duration: 0.75 }}
        >
          <DatesProvider settings={{ locale: language, timezone: 'UTC' }}>{children}</DatesProvider>
        </motion.main>
      </SWRConfig>
    </SessionProvider>
  )
}
