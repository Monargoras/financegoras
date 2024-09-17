'use server'

import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { TransactionType } from '@/utils/types'
import { db } from '@/utils/database'

export default async function submitTransaction(
  isIncome: boolean,
  isSavings: boolean,
  amount: number,
  name: string,
  category: string,
  transactionType: TransactionType,
  date: Date = new Date()
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return false
  }
  if (name.length === 0) {
    return false
  }
  if (amount === 0) {
    return false
  }

  const id = nanoid(16)
  const transaction = {
    isIncome,
    isSavings,
    amount,
    name,
    category,
    userId: session.user.id,
    id,
    createdAt: date,
    transactionType: TransactionType[transactionType],
    ...(transactionType === TransactionType.Single && {
      stoppedAt: date,
    }),
  }
  const res = await db.insertInto('transactions').values(transaction).executeTakeFirst()
  return Number(res.numInsertedOrUpdatedRows) > 0
}
