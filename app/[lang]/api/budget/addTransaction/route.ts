import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/utils/database'
import { TransactionType } from '@/utils/types'

/**
 * This endpoint accepts new transactions and adds them to the database
 * @allowedMethods POST
 * @body { isIncome, amount, name, category, transactionType }
 * @returns 200 if the transaction was added successfully, error otherwise
 */
export async function POST(req: NextRequest) {
  const data = await req.json()
  const id = nanoid(16)
  const transaction = {
    ...data,
    id,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    transactionType: TransactionType[data.transactionType],
  }
  const { insertId } = await db.insertInto('transactions').values(transaction).executeTakeFirstOrThrow()
  return Response.json({ insertId }, { status: 200 })
}
