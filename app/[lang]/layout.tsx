import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { getServerSession } from 'next-auth'
import '@/app/[lang]/globals.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { theme } from '@/utils/theme'
import { Appbar } from '@/components/Appbar/Appbar'
import { getDictionary } from './dictionaries'
import ClientProviders from '@/components/ClientProviders/ClientProviders'
import { PageProps } from '@/utils/types'

export async function generateMetadata(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.general.appName,
    description: dict.landingPage.introText,
  }
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'de' }]
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: PageProps }) {
  const { lang } = await params
  // get currently used dictionary
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)

  return (
    <html lang={lang} style={{ overflowX: 'hidden' }} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-icon.png" />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
        <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#339af0" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#339af0" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ClientProviders session={session} language={lang} dict={dict}>
            <Appbar props={{ dictionary: dict }}>{children}</Appbar>
            <Notifications />
          </ClientProviders>
        </MantineProvider>
      </body>
    </html>
  )
}
