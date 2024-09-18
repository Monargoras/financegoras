import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { demoUserId } from '@/utils/CONSTANTS'
import { valueToBoolean } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getMonthlyExpenseEvolution from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getIncExpEvolution from '../getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyData from '../getAggregatedTransactions/getMonthlyDataAction'
import getExpensesByCategory from '../getExpensesByCategory/getExpensesByCategoryAction'
import getTransactions from '../getTransactions/getTransactionsAction'
import { DashboardData } from '@/utils/types'
import getCategories from '../getCategories/getCategoriesAction'

/**
 * This endpoint returns the evolution of expenses per category the last 12 months or the given year
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param selectedMonth - the selected month
 * @param year - the year
 * @param selectedYear - the selected year
 * @param includeSavings - if true, the expenses are calculated with savings combined
 * @param lang - the current language used by user for month names
 * @param grouped - if true, the expenses are grouped by category group
 * @param includeEmptyCategories - if true, empty categories are included in the radar plot data
 * @param demo - set if demo data is requested
 * @returns body containing DasboardData
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const isDemo = valueToBoolean(request.nextUrl.searchParams.get('demo'))
  if ((!session || !session.user) && !isDemo) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

  const monthString = request.nextUrl.searchParams.get('month')
  const selectedMonthString = request.nextUrl.searchParams.get('selectedMonth')
  const yearString = request.nextUrl.searchParams.get('year')
  const selectedYearString = request.nextUrl.searchParams.get('selectedYear')
  const includeSavings = valueToBoolean(request.nextUrl.searchParams.get('includeSavings'))
  const grouped = valueToBoolean(request.nextUrl.searchParams.get('grouped'))
  const includeEmptyCategories = valueToBoolean(request.nextUrl.searchParams.get('includeEmptyCategories'))
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  if (
    !yearString ||
    includeSavings === null ||
    grouped === null ||
    selectedMonthString === null ||
    selectedYearString === null ||
    includeEmptyCategories === null
  ) {
    return new Response('More fields are required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const selectedMonth = parseInt(selectedMonthString, 10)
  const year = parseInt(yearString, 10)
  const selectedYear = parseInt(selectedYearString, 10)

  // get all dashoard data sets as promises all
  const res = await Promise.all([
    getMonthlyExpenseEvolution(userId, year, month, lang, includeSavings, grouped),
    getIncExpEvolution(userId, year, month, lang),
    getMonthlyData(userId, selectedYear, selectedMonth),
    getExpensesByCategory(userId, selectedYear, selectedMonth, includeSavings, grouped, includeEmptyCategories),
    getTransactions(userId, selectedYear, selectedMonth),
    getCategories(userId),
  ])

  return new Response(
    JSON.stringify({
      monthlyExpenseEvolution: res[0],
      incExpEvolution: res[1],
      monthlyStats: res[2],
      expensesByCategory: res[3],
      transactions: res[4],
      categories: res[5],
    } as DashboardData),
    { status: 200 }
  )
}
