'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { db } from '@/utils/database'
import { TransactionType } from '@/utils/types'

export default async function updateTransaction(
  id: string,
  isIncome: boolean,
  isSavings: boolean,
  amount: number,
  name: string,
  category: string,
  transactionType: string,
  createdAt: Date,
  stoppedAt: Date | null
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return false
  }
  if (name.length === 0) {
    return false
  }
  if (amount === 0) {
    return false
  }
  if (!createdAt) {
    return false
  }
  if (transactionType === TransactionType[TransactionType.Single] && createdAt.getTime() !== stoppedAt?.getTime()) {
    return false
  }

  await db
    .updateTable('transactions')
    .set({
      id,
      isIncome,
      isSavings,
      amount,
      name,
      category,
      transactionType,
      createdAt,
      stoppedAt,
    })
    .where((eb) => eb.and([eb('id', '=', id), eb('userId', '=', session.user.id)]))
    .executeTakeFirst()
  return true
}
