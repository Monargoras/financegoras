import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { getTransactionType, Transaction } from '@/utils/types'

/**
 * This endpoint returns all transactions from the database
 * @allowedMethods GET
 * @returns body containing the transactions for the logged in user
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', session.user.id)
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res: Transaction[] = transactions.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  return Response.json(res, { status: 200 })
}
