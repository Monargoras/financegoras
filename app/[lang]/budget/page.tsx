import { Container, Divider, Flex } from '@mantine/core'
import { getServerSession } from 'next-auth'
import { Categories, DashboardData, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import Dashboard from '@/components/Dashboard/Dashboard'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import getMonthlyData from '@/app/api/budget/getAggregatedTransactions/getMonthlyDataAction'
import getExpensesByCategory from '@/app/api/budget/getExpensesByCategory/getExpensesByCategoryAction'
import getIncExpEvolution from '@/app/api/budget/getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyExpenseEvolution from '@/app/api/budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getTransactions from '@/app/api/budget/getTransactions/getTransactionsAction'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'

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

async function getInitialDashboardData({ lang }: { lang: string }): Promise<DashboardData> {
  'use server'

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return {
      monthlyExpenseEvolution: [],
      incExpEvolution: [],
      monthlyStats: {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
      },
      expensesByCategory: [],
      transactions: [],
    }
  }

  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()
  const includeSavings = false
  const userId = session.user.id
  const monthlyExpenseEvolution = await getMonthlyExpenseEvolution(userId, curYear, curMonth, lang, includeSavings)
  const incExpEvolution = await getIncExpEvolution(userId, curYear, curMonth, lang)
  const monthlyStats = await getMonthlyData(userId, curYear, curMonth)
  const expensesByCategory = await getExpensesByCategory(userId, curYear, curMonth, includeSavings)
  const transactions = await getTransactions(userId, curYear, curMonth)

  return {
    monthlyExpenseEvolution,
    incExpEvolution,
    monthlyStats,
    expensesByCategory,
    transactions,
  }
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

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  const initialData = await getInitialDashboardData({ lang })
  const initialCategories = await getInitialCategories()

  return (
    <PageTransitionProvider>
      {session?.user ? (
        <Container fluid>
          <Flex gap="md" justify="center" align="center" direction="column">
            <IncomeExpenseForm dictionary={dict} initialData={initialCategories} />
            <Divider size="lg" w="100%" />
            <Dashboard lang={lang} dictionary={dict} demo={false} initialData={initialData} />
          </Flex>
        </Container>
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
