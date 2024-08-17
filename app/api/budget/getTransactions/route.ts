import { db } from '@/utils/database'

/**
 * This endpoint returns all transactions from the database
 * @allowedMethods GET
 * @returns body containing the transactions as an array
 */
export async function GET() {
  const transactions = await db.selectFrom('transactions').orderBy('createdAt', 'desc').selectAll().execute()
  return Response.json({ transactions }, { status: 200 })
}
