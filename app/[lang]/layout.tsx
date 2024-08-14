import '@mantine/core/styles.css'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { theme } from '../../theme'
import { Appbar } from '@/components/Appbar/Appbar'

export const metadata = {
  title: 'Financegoras',
  description: 'Analyze your finances with ease!',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Appbar>{children}</Appbar>
        </MantineProvider>
      </body>
    </html>
  )
}
