'use server'

import { db } from '@/utils/database'
import { TransactionType } from '@/utils/types'
import { getUserId } from '@/utils/authUtils'

export default async function stopSeriesTransaction(id: string, transactionType: string, createdAt: string) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }
  if (!createdAt) {
    return false
  }
  if (transactionType === TransactionType[TransactionType.Single]) {
    return false
  }
  // calc stoppedAt from createdAt and transactionType
  const stoppedAt = new Date(createdAt)
  // set year to current year
  stoppedAt.setFullYear(new Date().getFullYear())
  // set month to current month if transaction type is monthly
  if (transactionType === TransactionType[TransactionType.Monthly]) {
    stoppedAt.setMonth(new Date().getMonth())
  }
  const isInFuture = stoppedAt > new Date()
  // if transaction has not been payed in this interval yet, set stoppedAt to month before the next interval
  if (isInFuture) {
    if (transactionType === TransactionType[TransactionType.Monthly]) {
      stoppedAt.setMonth(stoppedAt.getMonth() - 1)
    } else {
      stoppedAt.setMonth(new Date(createdAt).getMonth() - 1)
    }
    // if transaction has been payed in this interval, set stoppedAt to month before the next interval for annual
    // monthly already xorrect with current month
  } else if (transactionType === TransactionType[TransactionType.Annual]) {
    stoppedAt.setFullYear(new Date().getFullYear() + 1)
    stoppedAt.setMonth(new Date(createdAt).getMonth() - 1)
  }

  const res = await db
    .updateTable('transactions')
    .set({
      stoppedAt,
    })
    .where((eb) => eb.and([eb('id', '=', id), eb('userId', '=', userId)]))
    .executeTakeFirst()
  return Number(res.numUpdatedRows) > 0
}
