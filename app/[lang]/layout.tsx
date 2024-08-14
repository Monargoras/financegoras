import '@mantine/core/styles.css'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { theme } from '../../theme'
import { Appbar } from '@/components/Appbar/Appbar'
import { getDictionary } from './dictionaries'

export const metadata = {
  title: 'Financegoras',
  description: 'Analyze your finances with ease!',
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

  return (
    <html lang={params.lang}>
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Appbar props={{ dictionary: dict }}>{children}</Appbar>
        </MantineProvider>
      </body>
    </html>
  )
}
