import { db } from '@/utils/database'
import { Transaction, TransactionType } from '@/utils/types'

const calculateTotalPerMonth = (transactions: Transaction[]) =>
  transactions.reduce(
    (acc, transaction) =>
      transaction.transactionType === TransactionType.Annual ? acc + transaction.amount / 12 : acc + transaction.amount,
    0
  )

/**
 * This endpoint returns the aggregated transactions from the database for the current month
 * @allowedMethods GET
 * @returns body containing the transactions as an array
 */
export async function GET() {
  const incomeTransactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('stoppedAt', 'is', null)
    .where('isIncome', '=', true)
    .execute()
  const expenseTransactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('stoppedAt', 'is', undefined)
    .where('isIncome', '=', false)
    .execute()
  const totalIncome = calculateTotalPerMonth(incomeTransactions)
  const totalExpenses = calculateTotalPerMonth(expenseTransactions)
  return Response.json({ totalIncome, totalExpenses }, { status: 200 })
}
