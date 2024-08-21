import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { db } from '@/utils/database'
import { getTransactionType, Transaction, TransactionType } from '@/utils/types'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../getAggregatedTransactions/route'

/**
 * This endpoint returns the aggregated expenses per category for a given month or year.
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @returns body containing { category: string, total: number, percentage: number }[]
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
    .execute()

  // transform transaction type to enum
  const expenseTransactions: Transaction[] = expenseRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const expensesPerCategory = expenseTransactions.reduce(
    (acc, transaction) => {
      const { category } = transaction
      // timeframe month: annual transactions are divided by 12
      if (month && transaction.transactionType === TransactionType.Annual) {
        acc[category] = (acc[category] || 0) + transaction.amount / 12
        return acc
      }
      // timeframe year: monthly transactions are multiplied by 12
      if (!month && transaction.transactionType === TransactionType.Monthly) {
        acc[category] = (acc[category] || 0) + transaction.amount * 12
        return acc
      }
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    },
    {} as Record<string, number>
  )

  const totalExpense = month
    ? parseFloat(calculateTotalPerMonth(expenseTransactions))
    : parseFloat(calculateTotalPerYear(expenseTransactions))

  const expenses = Object.entries(expensesPerCategory).map(([category, total]) => ({
    category,
    total: total.toFixed(2),
    percentage: ((total / totalExpense) * 100).toFixed(2),
  }))

  return new Response(JSON.stringify(expenses), { status: 200 })
}
