import { Flex } from '@mantine/core'
import { DashboardDTO, PageProps, TransactionType } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import getMonthlyData from '@/app/api/budget/getAggregatedTransactions/getMonthlyDataAction'
import getExpensesByCategory from '@/app/api/budget/getExpensesByCategory/getExpensesByCategoryAction'
import getIncExpEvolution from '@/app/api/budget/getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyExpenseEvolution from '@/app/api/budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getTransactions from '@/app/api/budget/getTransactions/getTransactionsAction'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import generateDemoTransactions from '@/serverActions/generateDemoTransactions'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'
import DashboardContainer from '@/components/Dashboard/DashboardContainer'
import getColorMap from '@/app/api/budget/getColorMap/getColorMapAction'
import DemoButton from '@/components/Welcome/DemoButton'
import getNameAutocompleteList from '@/app/api/transactions/getNameAutocompleteList/getNameAutocompleteListAction'

export async function generateMetadata(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.budgetPage.metadataDemoTitle,
    description: dict.landingPage.introText,
  }
}

async function getInitialDemoData({ lang }: { lang: string }): Promise<DashboardDTO> {
  'use server'

  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()

  const includeSavings = false
  const grouped = false
  const percentage = false
  const includeEmptyCategories = false

  const userId = DEMOUSERID

  // get demo transactions for current month
  const tmpTransactions = await getTransactions(userId, curYear, curMonth)
  // remove monthly and annual transactions
  const filteredTransactions = tmpTransactions.filter(
    (t) => t.transactionType !== TransactionType.Monthly && t.transactionType !== TransactionType.Annual
  )
  // if there are no transactions for the current month, generate some
  if (filteredTransactions.length === 0) {
    await generateDemoTransactions(curYear, curMonth)
  }

  const [
    monthlyExpenseEvolution,
    incExpEvolution,
    monthlyStats,
    expensesByCategory,
    transactions,
    categories,
    colorMap,
    nameAutocompleteList,
  ] = await Promise.all([
    getMonthlyExpenseEvolution(userId, curYear, curMonth, lang, includeSavings, grouped),
    getIncExpEvolution(userId, curYear, curMonth, lang),
    getMonthlyData(userId, curYear, curMonth),
    getExpensesByCategory(userId, curYear, curMonth, includeSavings, grouped, includeEmptyCategories),
    getTransactions(userId, curYear, curMonth),
    getCategories(userId),
    getColorMap(userId),
    getNameAutocompleteList(userId),
  ])

  return {
    monthlyExpenseEvolution,
    incExpEvolution,
    monthlyStats,
    expensesByCategory,
    transactions,
    categories,
    settings: {
      grouped,
      percentage,
      includeSavings,
      includeEmptyCategories,
    },
    colorMap,
    nameAutocompleteList,
  }
}

export default async function DemoPage(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const initialData = await getInitialDemoData({ lang })

  return (
    <PageTransitionProvider>
      <DashboardContainer lang={lang} dict={dict} demo initialData={initialData} />
      <Flex justify="center" mt={16}>
        <DemoButton
          title={dict.analysisPage.analysisDemo}
          size="md"
          href="/demo/analysis"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        />
      </Flex>
    </PageTransitionProvider>
  )
}
