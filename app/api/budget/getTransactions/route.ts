import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { valueToBoolean } from '../../../../utils/getMonthlyExpenseEvolutionUtils'
import { demoUserId } from '@/utils/CONSTANTS'
import getTransactions from './getTransactionsAction'

/**
 * This endpoint returns all transactions from the database
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param demo - set if demo data is requested
 * @returns body containing the transactions in the timeframe as an array
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

  if (!yearString) {
    return new Response('More fields required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const res = await getTransactions(userId, year, month)

  return Response.json(res, { status: 200 })
}
