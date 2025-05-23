'use server'

import { db } from '@/utils/database'
import { TransactionType } from '@/utils/types'
import { getUserId } from '@/utils/authUtils'

export default async function updateTransaction(
  id: string,
  isIncome: boolean,
  isSavings: boolean,
  amount: number,
  name: string,
  category: string,
  transactionType: string,
  createdAt: string,
  stoppedAt: string | null
) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }
  if (name.length === 0 || name.length > 50) {
    return false
  }
  // 12 digits allow for 999 999 999.99 or even 99 999 999 999 (frontend adds the space and therefore only allows tens of billions without decimals)
  // (spaces added for readability)
  if (amount === 0 || amount.toString().length > 12) {
    return false
  }
  if (!createdAt) {
    return false
  }
  if (transactionType === TransactionType[TransactionType.Single] && createdAt !== stoppedAt) {
    return false
  }

  const res = await db
    .updateTable('transactions')
    .set({
      isIncome,
      isSavings,
      amount,
      name: name.trim(),
      category,
      transactionType,
      createdAt: new Date(createdAt),
      stoppedAt: stoppedAt ? new Date(stoppedAt) : null,
    })
    .where((eb) => eb.and([eb('id', '=', id), eb('userId', '=', userId)]))
    .executeTakeFirst()
  return Number(res.numUpdatedRows) > 0
}
