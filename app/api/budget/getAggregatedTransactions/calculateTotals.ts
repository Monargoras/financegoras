import { TransactionDTO, TransactionType } from '@/utils/types'

export const calculateTotalPerMonth = (transactions: TransactionDTO[]) => {
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
export const calculateTotalPerYear = (transactions: TransactionDTO[], year: number) => {
  let sum = 0
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType.Monthly) {
      const { createdAt, stoppedAt } = transaction
      const monthsActive =
        12 -
        (new Date(createdAt).getUTCFullYear() === year ? new Date(createdAt).getUTCMonth() : 0) -
        (stoppedAt && new Date(stoppedAt).getUTCFullYear() === year ? 12 - new Date(stoppedAt).getUTCMonth() : 0)
      sum += transaction.amount * monthsActive
    } else {
      sum += transaction.amount
    }
  }
  return sum.toFixed(2)
}
