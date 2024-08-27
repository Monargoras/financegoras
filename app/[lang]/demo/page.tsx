import { Container, Flex } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import Dashboard from '@/components/Dashboard/Dashboard'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'

const englishMetadata = {
  title: 'Demo - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Demo - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

export default async function DemoPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)

  return (
    <PageTransitionProvider>
      <Container fluid>
        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
          <Dashboard lang={lang} dictionary={dict} demo />
        </Flex>
      </Container>
    </PageTransitionProvider>
  )
}
