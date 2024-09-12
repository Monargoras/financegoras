'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { CategoryExpenseData, getTransactionType, Transaction, TransactionType } from '@/utils/types'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../utils/calculateTotals'
import { demoUserId } from '@/utils/CONSTANTS'
import { authOptions } from '../app/api/auth/[...nextauth]/authOptions'

export default async function getExpensesByCategory(
  year: number,
  month: number | null,
  includeSavings: boolean,
  isDemo: boolean = false
): Promise<CategoryExpenseData[] | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && !isDemo) {
    return null
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

  let expenseQuery = db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .where('isIncome', '=', false)

  if (!includeSavings) {
    expenseQuery = expenseQuery.where('isSavings', '=', false)
  }

  const expenseRes = await expenseQuery.execute()

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
      // timeframe year: monthly transactions are multiplied by 12 minus the months the transaction was inactive
      if (!month && transaction.transactionType === TransactionType.Monthly) {
        const { createdAt, stoppedAt } = transaction
        const monthsActive =
          12 -
          (createdAt.getFullYear() === year ? createdAt.getMonth() : 0) -
          (stoppedAt?.getFullYear() === year ? 12 - stoppedAt.getMonth() : 0)
        acc[category] = (acc[category] || 0) + transaction.amount * monthsActive
        return acc
      }
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    },
    {} as Record<string, number>
  )

  const totalExpense = month
    ? parseFloat(calculateTotalPerMonth(expenseTransactions))
    : parseFloat(calculateTotalPerYear(expenseTransactions, year))

  const expenses = Object.entries(expensesPerCategory).map(([category, total]) => ({
    category,
    value: parseFloat(((total / totalExpense) * 100).toFixed(2)),
  }))

  return expenses
}
