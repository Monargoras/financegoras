import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

/**
 * This endpoint returns all transactions from the database
 * @allowedMethods GET
 * @returns body containing the transactions as an array
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
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'transactionType', 'createdAt'])
    .execute()
  return Response.json({ transactions }, { status: 200 })
}
