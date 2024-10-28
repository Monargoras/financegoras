import { Container, Divider, Flex } from '@mantine/core'
import { getServerSession } from 'next-auth'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import TransactionsDetailTable, {
  InitialDetailTableData,
} from '@/components/TransactionsDetailTable/TransactionsDetailTable'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'
import getAllTransactions from '@/app/api/transactions/getAllTransactions/getAllTransactionsAction'

export async function generateMetadata(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.transactionsPage.metadataPageTitle,
    description: dict.landingPage.introText,
  }
}

async function getInitialData(): Promise<InitialDetailTableData> {
  'use server'

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { categories: null, transactions: [] }
  }
  const categories = await getCategories(session.user.id)
  const transactions = await getAllTransactions(session.user.id)

  return { categories, transactions }
}

export default async function TransactionsPage(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  const initialData = await getInitialData()

  return (
    <PageTransitionProvider>
      {session?.user ? (
        <Container fluid>
          <Flex gap="md" justify="center" align="center" direction="column">
            <IncomeExpenseForm dictionary={dict} initialData={initialData.categories} />
            <Divider size="lg" w="100%" />
            <TransactionsDetailTable locale={lang} dictionary={dict} initialData={initialData} />
          </Flex>
        </Container>
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
