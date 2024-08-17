import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { Transaction, TransactionType } from '@/utils/types'
import { authOptions } from '../../auth/[...nextauth]/route'

const calculateTotalPerMonth = (transactions: Transaction[]) =>
  transactions.reduce(
    (acc, transaction) =>
      transaction.transactionType === TransactionType.Annual ? acc + transaction.amount / 12 : acc + transaction.amount,
    0
  )
// TODO add generalization for months and years
/**
 * This endpoint returns the aggregated transactions from the database for given timeframe
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @returns body containing the transactions as an array
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const incomeTransactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('stoppedAt', 'is', null)
    .where('isIncome', '=', true)
    .execute()
  const expenseTransactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('stoppedAt', 'is', undefined)
    .where('isIncome', '=', false)
    .execute()
  const totalIncome = calculateTotalPerMonth(incomeTransactions)
  const totalExpenses = calculateTotalPerMonth(expenseTransactions)
  return Response.json({ totalIncome, totalExpenses }, { status: 200 })
}
