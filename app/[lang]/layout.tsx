import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { theme } from '@/theme'
import { Appbar } from '@/components/Appbar/Appbar'
import { getDictionary } from './dictionaries'
import ClientProviders from '@/components/ClientProviders/ClientProviders'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import { i18n } from '@/middleware'

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
  return i18n.locales.map((lang) => ({ params: { lang } }))
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
