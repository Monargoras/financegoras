import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { db } from '@/utils/database'
import { Transaction, TransactionType } from '@/utils/types'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

const calculateTotalPerMonth = (transactions: Transaction[]) => {
  let sum = 0
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType[TransactionType.Annual]) {
      sum += transaction.amount / 12
    } else {
      sum += transaction.amount
    }
  }
  return sum.toFixed(2)
}

const calculateTotalPerYear = (transactions: Transaction[]) => {
  let sum = 0
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType[TransactionType.Monthly]) {
      sum += transaction.amount * 12
    } else {
      sum += transaction.amount
    }
  }
  return sum.toFixed(2)
}

/**
 * This endpoint returns the aggregated transactions from the database for given timeframe
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @returns body containing the transactions as an array
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')

  if (!yearString) {
    return new Response('Year is required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const incomeTransactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('createdAt', '>=', month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`))
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`)
      )
    )
    .where('isIncome', '=', true)
    .execute()

  const expenseTransactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('createdAt', '>=', month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`))
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`)
      )
    )
    .where('isIncome', '=', false)
    .execute()

  const totalIncome = month ? calculateTotalPerMonth(incomeTransactions) : calculateTotalPerYear(incomeTransactions)
  const totalExpenses = month ? calculateTotalPerMonth(expenseTransactions) : calculateTotalPerYear(expenseTransactions)

  return Response.json({ totalIncome, totalExpenses }, { status: 200 })
}
