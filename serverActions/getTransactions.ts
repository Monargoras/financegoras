'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { demoUserId } from '@/utils/CONSTANTS'
import { db } from '@/utils/database'
import { getTransactionType, Transaction } from '@/utils/types'

export default async function getTransactions(
  year: number,
  month: number | null,
  isDemo: boolean = false
): Promise<Transaction[] | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && !isDemo) {
    return null
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

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
