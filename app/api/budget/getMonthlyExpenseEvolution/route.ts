import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { getMonthlyExpenseDataOneMonth, getMonthYearTuples, valueToBoolean } from './getMonthlyExpenseEvolutionUtils'

/**
 * This endpoint returns the evolution of expenses per category the last 12 months or the given year
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param ofIncome - if true, the expenses are calculated as a percentage of the income
 * @param percentage - if true, the expenses are calculated as a percentage, otherwise as a sum
 * @returns body containing MonthlyExpenseEvolution
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')
  const ofIncome = valueToBoolean(request.nextUrl.searchParams.get('ofIncome'))
  const percentage = valueToBoolean(request.nextUrl.searchParams.get('percentage'))
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  if (!yearString || ofIncome === null || percentage === null) {
    return new Response('More fields is required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getMonthlyExpenseDataOneMonth(m, y, ofIncome, percentage, session.user.id, lang))
  )

  return new Response(JSON.stringify(expenses), { status: 200 })
}
