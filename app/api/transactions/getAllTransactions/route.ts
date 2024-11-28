import getAllTransactions from './getAllTransactionsAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns all transactions from the database
 * @allowedMethods GET
 * @returns body containing the transactions for the logged in user
 */
export async function GET() {
  const userId = await getUserId()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await getAllTransactions(userId)

  return Response.json(res, { status: 200 })
}
