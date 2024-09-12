import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import getAllTransactions from './getAllTransactionsAction'

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

  const res = await getAllTransactions(session.user.id)

  return Response.json(res, { status: 200 })
}
