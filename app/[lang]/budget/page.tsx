import { getServerSession } from 'next-auth'
import { DashboardData, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
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
import DashboardContainer from '@/components/Dashboard/DashboardContainer'
import getUserSettings from '@/serverActions/getUserSettings'
import getColorMap from '@/app/api/budget/getColorMap/getColorMapAction'

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
      incExpEvolution: {
        maxPercentageOfIncomUsed: 0,
        series: [],
      },
      monthlyStats: {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
      },
      expensesByCategory: [],
      transactions: [],
      categories: null,
      settings: {
        grouped: false,
        percentage: false,
        includeSavings: false,
        includeEmptyCategories: false,
      },
      colorMap: {},
    }
  }

  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()

  const userSettings = await getUserSettings()
  const includeSavings = userSettings ? userSettings.includeSavings : false
  const grouped = userSettings ? userSettings.grouped : false
  const percentage = userSettings ? userSettings.percentage : false
  const includeEmptyCategories = userSettings ? userSettings.includeEmptyCategories : false

  const userId = session.user.id

  const [
    monthlyExpenseEvolution,
    incExpEvolution,
    monthlyStats,
    expensesByCategory,
    transactions,
    categories,
    colorMap,
  ] = await Promise.all([
    getMonthlyExpenseEvolution(userId, curYear, curMonth, lang, includeSavings, grouped),
    getIncExpEvolution(userId, curYear, curMonth, lang),
    getMonthlyData(userId, curYear, curMonth),
    getExpensesByCategory(userId, curYear, curMonth, includeSavings, grouped, includeEmptyCategories),
    getTransactions(userId, curYear, curMonth),
    getCategories(userId),
    getColorMap(userId),
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
  }
}

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  const initialData = await getInitialDashboardData({ lang })

  return (
    <PageTransitionProvider>
      {session?.user ? (
        <DashboardContainer lang={lang} dict={dict} demo={false} initialData={initialData} />
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
