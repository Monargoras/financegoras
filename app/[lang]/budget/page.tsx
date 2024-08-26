import { Container, Divider, Flex } from '@mantine/core'
import { getServerSession } from 'next-auth'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import Dashboard from '@/components/Dashboard/Dashboard'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'

const englishMetadata = {
  title: 'Budget Book - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Haushaltsbuch - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)

  return (
    <PageTransitionProvider>
      {session?.user ? (
        <Container fluid>
          <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
            <IncomeExpenseForm dictionary={dict} />
            <Divider size="lg" w="100%" />
            <Dashboard lang={lang} dictionary={dict} />
          </Flex>
        </Container>
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
