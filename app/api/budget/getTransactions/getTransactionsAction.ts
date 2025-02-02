'use server'

import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'
import { TransactionDTO, TransactionType } from '@/utils/types'
import { validateUserId } from '@/utils/authUtils'

export default async function getTransactions(userId: string, date: Date): Promise<TransactionDTO[]> {
  const validatedUserId = await validateUserId(userId)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', validatedUserId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res = parseDatabaseTransactionsArray(transactions)

  // sort array, first all monthly and single transactions, then annual transactions
  const nonAnnual = res
    .filter((ta) => ta.transactionType !== TransactionType.Annual)
    .sort((a, b) => new Date(b.createdAt).getDate() - new Date(a.createdAt).getDate())
  const annual = res
    .filter((ta) => ta.transactionType === TransactionType.Annual)
    .sort((a, b) => new Date(b.createdAt).getDate() - new Date(a.createdAt).getDate())

  return [...nonAnnual, ...annual]
}
