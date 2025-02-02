import { NextRequest } from 'next/server'
import { valueToBoolean } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import getMonthlyData from './getMonthlyDataAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns the aggregated transactions from the database for given timeframe
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param demo - set if demo data is requested
 * @returns body containing AggregatedIncomeExpenseTotals
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

  if (!yearString) {
    return new Response('Year is required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const res = await getMonthlyData(userId, year, month)

  return Response.json(res, { status: 200 })
}
