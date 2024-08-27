import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { getIncExpOneMonth } from './getIncExpEvolutionUtils'
import { getMonthYearTuples, valueToBoolean } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { demoUserId } from '@/utils/CONSTANTS'

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
  const session = await getServerSession(authOptions)
  const isDemo = valueToBoolean(request.nextUrl.searchParams.get('demo'))
  if ((!session || !session.user) && !isDemo) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

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
  const expenses = await Promise.all(monthsToCompute.map(([m, y]) => getIncExpOneMonth(m, y, userId, lang)))

  return new Response(JSON.stringify(expenses), { status: 200 })
}
