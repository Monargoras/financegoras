import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { db } from '@/utils/database'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

/**
 * This endpoint returns all transactions from the database
 * @allowedMethods GET
 * @params month - the month of the year (optional)
 * @params year - the year
 * @returns body containing the transactions in the timeframe as an array
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')

  if (!yearString) {
    return new Response('More fields required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', session.user.id)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()
  return Response.json(transactions, { status: 200 })
}
