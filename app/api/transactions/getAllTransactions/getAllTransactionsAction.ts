'use server'

import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'
import { Transaction } from '@/utils/types'
import { validateUserId } from '@/utils/authUtils'

export default async function getAllTransactions(userId: string): Promise<Transaction[]> {
  const validatedUserId = await validateUserId(userId)

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', validatedUserId)
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res = parseDatabaseTransactionsArray(transactions)

  return res
}
