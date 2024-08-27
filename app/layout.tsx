import { ColorSchemeScript } from '@mantine/core'

export const metadata = {
  title: 'Not Found - Financegoras',
  description: 'Page not found',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ overflowX: 'hidden' }}>
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  )
}
