import { NextRequest } from 'next/server'
import { valueToBoolean } from './getMonthlyExpenseEvolutionUtils'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import getMonthlyExpenseEvolution from './getMonthlyExpenseEvolutionAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns the evolution of expenses per category the last 12 months or the given year
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param includeSavings - if true, the expenses are calculated with savings combined
 * @param lang - the current language used by user for month names
 * @param grouped - if true, the expenses are grouped by category group
 * @param demo - set if demo data is requested
 * @returns body containing MonthlyExpenseEvolution
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
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  if (!yearString || includeSavings === null || grouped === null) {
    return new Response('More fields are required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const res = await getMonthlyExpenseEvolution(userId, year, month, lang, includeSavings, grouped)

  return new Response(JSON.stringify(res), { status: 200 })
}
