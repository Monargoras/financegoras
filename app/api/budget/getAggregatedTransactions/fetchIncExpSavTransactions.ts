import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'

export const fetchIncExpSavTransactions = async (userId: string, year: number, month: number | null) => {
  const incomeRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .where('isIncome', '=', true)
    .execute()

  const expenseRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .where('isIncome', '=', false)
    .where('isSavings', '=', false)
    .execute()

  const savingsRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .where('isIncome', '=', false)
    .where('isSavings', '=', true)
    .execute()

  // transform transaction type to enum
  const incomeTransactions = parseDatabaseTransactionsArray(incomeRes)

  const expenseTransactions = parseDatabaseTransactionsArray(expenseRes)

  const savingsTransactions = parseDatabaseTransactionsArray(savingsRes)

  return { incomeTransactions, expenseTransactions, savingsTransactions }
}
