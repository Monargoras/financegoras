import { Container, Divider, Flex } from '@mantine/core'
import { getServerSession } from 'next-auth'
import { Categories, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import TransactionsDetailTable from '@/components/TransactionsDetailTable/TransactionsDetailTable'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'

const englishMetadata = {
  title: 'Transactions - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Transaktionen - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

async function getInitialCategories(): Promise<Categories | null> {
  'use server'

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }
  const categories = await getCategories(session.user.id)

  return categories
}

export default async function TransactionsPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  const initialData = await getInitialCategories()

  return (
    <PageTransitionProvider>
      {session?.user ? (
        <Container fluid>
          <Flex gap="md" justify="center" align="center" direction="column">
            <IncomeExpenseForm dictionary={dict} initialData={initialData} />
            <Divider size="lg" w="100%" />
            <TransactionsDetailTable locale={lang} dictionary={dict} />
          </Flex>
        </Container>
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
