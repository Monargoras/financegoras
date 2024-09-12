'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { getTransactionType, Transaction } from '@/utils/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function getAllTransactions(): Promise<Transaction[] | null> {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return null
  }

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', session.user.id)
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res: Transaction[] = transactions.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  return res
}
