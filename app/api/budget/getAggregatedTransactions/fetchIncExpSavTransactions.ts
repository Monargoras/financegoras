import { db } from '@/utils/database'
import { getTransactionType, Transaction } from '@/utils/types'

export const fetchIncExpSavTransactions = async (userId: string, year: number, month: number | null) => {
  const incomeRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', true)
    .execute()

  const expenseRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', false)
    .where('isSavings', '=', false)
    .execute()

  const savingsRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', false)
    .where('isSavings', '=', true)
    .execute()

  // transform transaction type to enum
  const incomeTransactions: Transaction[] = incomeRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const expenseTransactions: Transaction[] = expenseRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const savingsTransactions: Transaction[] = savingsRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  return { incomeTransactions, expenseTransactions, savingsTransactions }
}
