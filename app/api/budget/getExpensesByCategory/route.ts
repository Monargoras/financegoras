import { NextRequest } from 'next/server'
import { valueToBoolean } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import getExpensesByCategory from './getExpensesByCategoryAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns the aggregated expenses per category for a given month or year.
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param includeSavings - if true, the expenses are calculated with savings combined
 * @param grouped - if true, the expenses are aggregated by groups of categories
 * @param demo - set if demo data is requested
 * @param includeEmptyCategories - if true, empty categories are included in the radar plot data
 * @returns body containing CategoryExpenseData[]
 */
export async function GET(request: NextRequest) {
  const uId = await getUserId()
  const isDemo = valueToBoolean(request.nextUrl.searchParams.get('demo'))
  if (!uId && !isDemo) {
    return new Response('Unauthorized', { status: 401 })
  }
  const userId = uId && !isDemo ? uId : DEMOUSERID

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')
  const includeSavings = valueToBoolean(request.nextUrl.searchParams.get('includeSavings'))
  const grouped = valueToBoolean(request.nextUrl.searchParams.get('grouped'))
  const includeEmptyCategories = valueToBoolean(request.nextUrl.searchParams.get('includeEmptyCategories'))

  if (!yearString || includeSavings === null || grouped === null || includeEmptyCategories === null) {
    return new Response('More fields required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const res = await getExpensesByCategory(userId, year, month, includeSavings, grouped, includeEmptyCategories)

  return new Response(JSON.stringify(res), { status: 200 })
}
