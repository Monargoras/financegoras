import { NextRequest } from 'next/server'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import { valueToBoolean } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getMonthlyExpenseEvolution from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getIncExpEvolution from '../getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyData from '../getAggregatedTransactions/getMonthlyDataAction'
import getExpensesByCategory from '../getExpensesByCategory/getExpensesByCategoryAction'
import getTransactions from '../getTransactions/getTransactionsAction'
import { DashboardDTO } from '@/utils/types'
import getCategories from '../getCategories/getCategoriesAction'
import getColorMap from '../getColorMap/getColorMapAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns the all data needed for the dashboard
 * @allowedMethods GET
 * @param date - the starting date of the timeframe
 * @param selectedDate - the selected date in the timeframe
 * @param includeSavings - if true, the expenses are calculated with savings combined
 * @param lang - the current language used by user for month names
 * @param grouped - if true, the expenses are grouped by category group
 * @param includeEmptyCategories - if true, empty categories are included in the radar plot data
 * @param demo - set if demo data is requested
 * @returns body containing DasboardData
 */
export async function GET(request: NextRequest) {
  const uId = await getUserId()
  const isDemo = valueToBoolean(request.nextUrl.searchParams.get('demo'))
  if (!uId && !isDemo) {
    return new Response('Unauthorized', { status: 401 })
  }
  const userId = uId && !isDemo ? uId : DEMOUSERID

  const dateString = request.nextUrl.searchParams.get('date')
  const selectedDateString = request.nextUrl.searchParams.get('selectedDate')
  const includeSavings = valueToBoolean(request.nextUrl.searchParams.get('includeSavings'))
  const grouped = valueToBoolean(request.nextUrl.searchParams.get('grouped'))
  const includeEmptyCategories = valueToBoolean(request.nextUrl.searchParams.get('includeEmptyCategories'))
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  if (
    dateString === null ||
    selectedDateString === null ||
    includeSavings === null ||
    grouped === null ||
    includeEmptyCategories === null
  ) {
    return new Response('More fields are required', { status: 400 })
  }

  const date = new Date(dateString)
  const selectedDate = new Date(selectedDateString)

  // get all dashoard data sets as promises all
  const res = await Promise.all([
    getMonthlyExpenseEvolution(userId, date, lang, includeSavings, grouped),
    getIncExpEvolution(userId, date, lang),
    getMonthlyData(userId, selectedDate),
    getExpensesByCategory(userId, selectedDate, includeSavings, grouped, includeEmptyCategories),
    getTransactions(userId, selectedDate),
    getCategories(userId),
    getColorMap(userId),
  ])

  return new Response(
    JSON.stringify({
      monthlyExpenseEvolution: res[0],
      incExpEvolution: res[1],
      monthlyStats: res[2],
      expensesByCategory: res[3],
      transactions: res[4],
      categories: res[5],
      colorMap: res[6],
    } as DashboardDTO),
    { status: 200 }
  )
}
