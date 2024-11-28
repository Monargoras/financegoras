'use server'

import { nanoid } from 'nanoid'
import { TransactionType } from '@/utils/types'
import { db } from '@/utils/database'
import { getUserId } from '@/utils/authUtils'

export default async function submitTransaction(
  isIncome: boolean,
  isSavings: boolean,
  amount: number,
  name: string,
  category: string,
  transactionType: TransactionType,
  date: string = new Date().toUTCString()
) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }
  if (name.length === 0 || name.length > 50) {
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
    userId,
    id,
    createdAt: new Date(date),
    transactionType: TransactionType[transactionType],
    ...(transactionType === TransactionType.Single && {
      stoppedAt: new Date(date),
    }),
  }
  const res = await db.insertInto('transactions').values(transaction).executeTakeFirst()
  return Number(res.numInsertedOrUpdatedRows) > 0
}
