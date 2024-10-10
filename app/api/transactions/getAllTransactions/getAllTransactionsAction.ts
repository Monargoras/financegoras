'use server'

import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'
import { Transaction } from '@/utils/types'

export default async function getAllTransactions(userId: string): Promise<Transaction[]> {
  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res = parseDatabaseTransactionsArray(transactions)

  return res
}
