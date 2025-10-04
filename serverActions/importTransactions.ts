'use server'

import { nanoid } from 'nanoid'
import { TransactionDTO, TransactionType } from '@/utils/types'
import { db } from '@/utils/database'
import { getUserId } from '@/utils/authUtils'

export default async function importTransactions(transactions: TransactionDTO[], truncateExistingData: boolean) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }
  if (truncateExistingData) {
    await db.deleteFrom('transactions').where('userId', '=', userId).execute()
  }
  const results = transactions.map(async (tx) => {
    const { amount, name, category, createdAt, transactionType, stoppedAt, isIncome, isSavings } = tx
    if (name.length === 0 || name.length > 50) {
      return false
    }
    // 12 digits allow for 999 999 999.99 or even 99 999 999 999 (frontend adds the space and therefore only allows tens of billions without decimals)
    // (spaces added for readability)
    if (amount === 0 || amount.toString().length > 12) {
      return false
    }

    const id = nanoid(16)
    const transaction = {
      isIncome,
      isSavings,
      amount,
      name: name.trim(),
      category,
      userId,
      id,
      createdAt: new Date(createdAt),
      transactionType: TransactionType[transactionType],
      stoppedAt: stoppedAt ? new Date(stoppedAt) : null,
    }
    const res = await db.insertInto('transactions').values(transaction).executeTakeFirst()
    return res.numInsertedOrUpdatedRows
  })
  const numberOfInserted = await Promise.all(results).then((res) => res.filter((r) => r).length)
  return numberOfInserted
}
