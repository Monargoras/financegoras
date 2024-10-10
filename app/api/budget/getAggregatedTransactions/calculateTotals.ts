import { Transaction, TransactionType } from '@/utils/types'

export const calculateTotalPerMonth = (transactions: Transaction[]) => {
  let sum = 0
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType.Annual) {
      sum += transaction.amount / 12
    } else {
      sum += transaction.amount
    }
  }
  return sum.toFixed(2)
}

// check for monthly how many months they were active in the year
export const calculateTotalPerYear = (transactions: Transaction[], year: number) => {
  let sum = 0
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType.Monthly) {
      const { createdAt, stoppedAt } = transaction
      const monthsActive =
        12 -
        (new Date(createdAt).getFullYear() === year ? new Date(createdAt).getMonth() : 0) -
        (stoppedAt && new Date(stoppedAt).getFullYear() === year ? 12 - new Date(stoppedAt).getMonth() : 0)
      sum += transaction.amount * monthsActive
    } else {
      sum += transaction.amount
    }
  }
  return sum.toFixed(2)
}
