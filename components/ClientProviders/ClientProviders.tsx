'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
import { DatesProvider } from '@mantine/dates'
import { SWRConfig } from 'swr'
import { createContext, useState } from 'react'

// react context for switching privacy mode
export const PrivacyModeContext = createContext({
  privacyMode: false,
  togglePrivacyMode: () => {},
})

export default function ClientProviders({
  session,
  language,
  children,
}: {
  session: Session | null | undefined
  language: string
  children: React.ReactNode
}) {
  const [privacyMode, setPrivacyMode] = useState(false)
  const togglePrivacyMode = () => setPrivacyMode((prev) => !prev)

  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <DatesProvider settings={{ locale: language, timezone: 'UTC' }}>
          <PrivacyModeContext.Provider value={{ privacyMode, togglePrivacyMode }}>
            {children}
          </PrivacyModeContext.Provider>
        </DatesProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
