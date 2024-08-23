import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { TransactionType } from '@/utils/types'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

/**
 * This endpoint accepts new transactions and adds them to the database
 * @allowedMethods POST
 * @body { isIncome, isSavings, amount, name, category, transactionType, date? }
 * @returns 200 if the transaction was added successfully, error otherwise
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()
  if (
    data.isIncome === undefined ||
    data.isSavings === undefined ||
    data.amount === undefined ||
    data.name === undefined ||
    data.category === undefined ||
    data.transactionType === undefined
  ) {
    return new Response('Missing required fields', { status: 400 })
  }

  const id = nanoid(16)
  const transaction = {
    isIncome: data.isIncome,
    isSavings: data.isSavings,
    amount: data.amount,
    name: data.name,
    category: data.category,
    userId: session.user.id,
    id,
    createdAt: (data.date ? new Date(data.date) : new Date()).toISOString().slice(0, 19).replace('T', ' '),
    transactionType: TransactionType[data.transactionType],
    ...(data.transactionType === 0 && {
      stoppedAt: (data.date ? new Date(data.date) : new Date()).toISOString().slice(0, 19).replace('T', ' '),
    }),
  }
  const { insertId } = await db.insertInto('transactions').values(transaction).executeTakeFirst()
  return Response.json({ insertId }, { status: 200 })
}
