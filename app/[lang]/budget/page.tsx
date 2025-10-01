import { DashboardDTO, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import getMonthlyData from '@/app/api/budget/getAggregatedTransactions/getMonthlyDataAction'
import getExpensesByCategory from '@/app/api/budget/getExpensesByCategory/getExpensesByCategoryAction'
import getIncExpEvolution from '@/app/api/budget/getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyExpenseEvolution from '@/app/api/budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getTransactions from '@/app/api/budget/getTransactions/getTransactionsAction'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'
import DashboardContainer from '@/components/Dashboard/DashboardContainer'
import getUserSettings from '@/serverActions/getUserSettings'
import getColorMap from '@/app/api/budget/getColorMap/getColorMapAction'
import { getUserId } from '@/utils/authUtils'
import getNameAutocompleteList from '@/app/api/transactions/getNameAutocompleteList/getNameAutocompleteListAction'

export async function generateMetadata(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.budgetPage.metadataPageTitle,
    description: dict.landingPage.introText,
  }
}

async function getInitialDashboardData({ lang }: { lang: string }): Promise<DashboardDTO> {
  'use server'

  const userId = await getUserId()
  if (!userId) {
    return {
      monthlyExpenseEvolution: [],
      incExpEvolution: {
        maxPercentageOfIncomeUsed: 0,
        series: [],
      },
      monthlyStats: {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        averageExpensesToDate: 0,
        averagePercentageOfIncomeToDate: 0,
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
      nameAutocompleteList: [],
    }
  }

  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()

  const userSettings = await getUserSettings()
  const includeSavings = userSettings ? userSettings.includeSavings : false
  const grouped = userSettings ? userSettings.grouped : false
  const percentage = userSettings ? userSettings.percentage : false
  const includeEmptyCategories = userSettings ? userSettings.includeEmptyCategories : false

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

export default async function BudgetPage(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const userId = await getUserId()
  const initialData = await getInitialDashboardData({ lang })

  return (
    <PageTransitionProvider>
      {userId ? (
        <DashboardContainer lang={lang} dict={dict} demo={false} initialData={initialData} />
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
