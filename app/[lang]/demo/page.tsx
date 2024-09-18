import { DashboardData, PageProps, TransactionType } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import getMonthlyData from '@/app/api/budget/getAggregatedTransactions/getMonthlyDataAction'
import getExpensesByCategory from '@/app/api/budget/getExpensesByCategory/getExpensesByCategoryAction'
import getIncExpEvolution from '@/app/api/budget/getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyExpenseEvolution from '@/app/api/budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getTransactions from '@/app/api/budget/getTransactions/getTransactionsAction'
import { demoUserId } from '@/utils/CONSTANTS'
import generateDemoTransactions from '@/serverActions/generateDemoTransactions'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'
import DashboardContainer from '@/components/Dashboard/DashboardContainer'

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

async function getInitialDemoData({ lang }: { lang: string }): Promise<DashboardData> {
  'use server'

  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()
  const includeSavings = false
  const userId = demoUserId

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

  const monthlyExpenseEvolution = await getMonthlyExpenseEvolution(
    userId,
    curYear,
    curMonth,
    lang,
    includeSavings,
    false
  )
  const incExpEvolution = await getIncExpEvolution(userId, curYear, curMonth, lang)
  const monthlyStats = await getMonthlyData(userId, curYear, curMonth)
  const expensesByCategory = await getExpensesByCategory(userId, curYear, curMonth, includeSavings, false, true)
  const transactions = await getTransactions(userId, curYear, curMonth)
  const categories = await getCategories(userId)

  return {
    monthlyExpenseEvolution,
    incExpEvolution,
    monthlyStats,
    expensesByCategory,
    transactions,
    categories,
  }
}

export default async function DemoPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const initialData = await getInitialDemoData({ lang })

  return (
    <PageTransitionProvider>
      <DashboardContainer lang={lang} dict={dict} demo initialData={initialData} />
    </PageTransitionProvider>
  )
}
