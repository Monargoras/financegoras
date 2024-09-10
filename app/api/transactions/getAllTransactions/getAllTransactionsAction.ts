'use server'

import { db } from '@/utils/database'
import { getTransactionType, Transaction } from '@/utils/types'

export default async function getAllTransactions(userId: string): Promise<Transaction[]> {
  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res: Transaction[] = transactions.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  return res
}
