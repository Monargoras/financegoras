import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { db } from '@/utils/database'
import { getTransactionType, Transaction } from '@/utils/types'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { calculateTotalPerMonth, calculateTotalPerYear } from './calculateTotals'

/**
 * This endpoint returns the aggregated transactions from the database for given timeframe
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @returns body containing AggregatedIncomeExpenseTotals
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

  const incomeRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', true)
    .execute()

  const expenseRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', false)
    .where('isSavings', '=', false)
    .execute()

  const savingsRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', false)
    .where('isSavings', '=', true)
    .execute()

  // transform transaction type to enum
  const incomeTransactions: Transaction[] = incomeRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const expenseTransactions: Transaction[] = expenseRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const savingsTransactions: Transaction[] = savingsRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const totalIncome = month ? calculateTotalPerMonth(incomeTransactions) : calculateTotalPerYear(incomeTransactions)
  const totalExpenses = month ? calculateTotalPerMonth(expenseTransactions) : calculateTotalPerYear(expenseTransactions)
  const totalSavings = month ? calculateTotalPerMonth(savingsTransactions) : calculateTotalPerYear(savingsTransactions)

  return Response.json({ totalIncome, totalExpenses, totalSavings }, { status: 200 })
}
