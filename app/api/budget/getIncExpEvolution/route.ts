import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { getIncExpOneMonth } from './getIncExpEvolutionUtils'
import { getMonthYearTuples } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'

/**
 * This endpoint returns the evolution of income, expeneses and savings for the last 12 months or the given year.
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param lang - language code
 * @returns body containing AggregatedIncomeExpenseEvolution
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  if (!yearString) {
    return new Response('More fields are required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(monthsToCompute.map(([m, y]) => getIncExpOneMonth(m, y, session.user.id, lang)))

  return new Response(JSON.stringify(expenses), { status: 200 })
}
