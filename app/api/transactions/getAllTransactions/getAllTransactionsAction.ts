'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'
import { Transaction } from '@/utils/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getAllTransactions(userId: string): Promise<Transaction[]> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return []
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', validatedUserId)
    .orderBy('createdAt', 'desc')
    .select(['id', 'name', 'amount', 'category', 'isIncome', 'isSavings', 'transactionType', 'createdAt', 'stoppedAt'])
    .execute()

  const res = parseDatabaseTransactionsArray(transactions)

  return res
}
