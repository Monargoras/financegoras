import { Container, Divider, Flex } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import TransactionForm from '@/components/TransactionForm/TransactionForm'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import TransactionsDetailTable, {
  InitialDetailTableData,
} from '@/components/TransactionsDetailTable/TransactionsDetailTable'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'
import getAllTransactions from '@/app/api/transactions/getAllTransactions/getAllTransactionsAction'
import { getUserId } from '@/utils/authUtils'
import getNameAutocompleteList from '@/app/api/transactions/getNameAutocompleteList/getNameAutocompleteListAction'

export async function generateMetadata(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.transactionsPage.metadataPageTitle,
    description: dict.landingPage.introText,
  }
}

async function getInitialData(): Promise<{ nameAutocompleteList: string[]; tableData: InitialDetailTableData }> {
  'use server'

  const userId = await getUserId()
  if (!userId) {
    return { tableData: { categories: null, transactions: [] }, nameAutocompleteList: [] }
  }
  const categories = await getCategories(userId)
  const transactions = await getAllTransactions(userId)
  const nameAutocompleteList = await getNameAutocompleteList(userId)

  return {
    tableData: {
      categories,
      transactions: transactions.map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        stoppedAt: t.stoppedAt ? new Date(t.stoppedAt) : null,
      })),
    },
    nameAutocompleteList,
  }
}

export default async function TransactionsPage(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const userId = await getUserId()
  const initialData = await getInitialData()

  return (
    <PageTransitionProvider>
      {userId ? (
        <Container fluid>
          <Flex gap="md" justify="center" align="center" direction="column">
            <TransactionForm
              dictionary={dict}
              initialData={initialData.tableData.categories}
              nameAutocompleteList={initialData.nameAutocompleteList}
            />
            <Divider size="lg" w="100%" />
            <TransactionsDetailTable locale={lang} dictionary={dict} initialData={initialData.tableData} />
          </Flex>
        </Container>
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
