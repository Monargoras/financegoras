'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'
import { Transaction, TransactionType } from '@/utils/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getTransactions(
  userId: string,
  year: number,
  month: number | null
): Promise<Transaction[]> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return []
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

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
    .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())
  const annual = res
    .filter((ta) => ta.transactionType === TransactionType.Annual)
    .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())

  return [...nonAnnual, ...annual]
}
