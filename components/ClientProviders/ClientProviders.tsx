'use client'

import { SessionProvider } from 'next-auth/react'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
import { DatesProvider } from '@mantine/dates'
import { SWRConfig } from 'swr'
import { createContext, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useMantineTheme } from '@mantine/core'
import { Dictionary } from '@/utils/types'

// react context for switching privacy mode
export const PrivacyModeContext = createContext({
  privacyMode: false,
  togglePrivacyMode: () => {},
})

export default function ClientProviders({
  language,
  dict,
  children,
}: {
  language: string
  dict: Dictionary
  children: React.ReactNode
}) {
  const theme = useMantineTheme()
  const [privacyMode, setPrivacyMode] = useState(false)
  const togglePrivacyMode = () => {
    notifications.show({
      title: dict.general.privacyNotificationTitle,
      message: privacyMode ? dict.general.privacyNotificationOff : dict.general.privacyNotificationOn,
      color: theme.colors.primary[5],
      position: 'bottom-right',
    })
    setPrivacyMode((prev) => !prev)
  }

  return (
    <SessionProvider>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <DatesProvider settings={{ locale: language }}>
          <PrivacyModeContext.Provider value={{ privacyMode, togglePrivacyMode }}>
            {children}
          </PrivacyModeContext.Provider>
        </DatesProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
