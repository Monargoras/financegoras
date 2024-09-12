'use server'

import { db } from '@/utils/database'
import { getTransactionType, Transaction } from '@/utils/types'

export default async function getTransactions(
  userId: string,
  year: number,
  month: number | null
): Promise<Transaction[]> {
  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res: Transaction[] = transactions.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  return res
}
