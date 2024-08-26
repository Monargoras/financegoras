import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { theme } from '../../theme'
import { Appbar } from '@/components/Appbar/Appbar'
import { getDictionary } from './dictionaries'
import ClientProviders from '@/components/ClientProviders/ClientProviders'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'

const englishMetadata = {
  title: 'Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'de' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // get currently used dictionary
  const dict = await getDictionary(params.lang)
  const session = await getServerSession(authOptions)

  return (
    <html lang={params.lang} style={{ overflowX: 'hidden' }}>
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ClientProviders session={session} language={params.lang}>
            <Appbar props={{ dictionary: dict }}>{children}</Appbar>
            <Notifications />
          </ClientProviders>
        </MantineProvider>
      </body>
    </html>
  )
}
