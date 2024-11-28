import { NextRequest } from 'next/server'
import { valueToBoolean } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import getIncExpEvolution from './getIncExpEvolutionAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns the evolution of income, expeneses and savings for the last 12 months or the given year.
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param lang - language code
 * @param demo - set if demo data is requested
 * @returns body containing AggregatedIncomeExpenseEvolution
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
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  if (!yearString) {
    return new Response('More fields are required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const res = await getIncExpEvolution(userId, year, month, lang)

  return new Response(JSON.stringify(res), { status: 200 })
}
