'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
import { DatesProvider } from '@mantine/dates'
import { SWRConfig } from 'swr'

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
        <DatesProvider settings={{ locale: language, timezone: 'CET' }}>{children}</DatesProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
