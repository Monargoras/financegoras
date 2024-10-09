import { Transaction } from '@/utils/types'

export function getTransactionsInMonth(transactions: Transaction[], month: number, year: number) {
  const curMonth = transactions.filter(
    (transaction) =>
      transaction.createdAt < new Date(year, month, 1) &&
      (transaction.stoppedAt === null || transaction.stoppedAt >= new Date(year, month - 1, 1))
  )
  return curMonth
}
