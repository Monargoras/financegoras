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

export const calculateTotalPerYear = (transactions: Transaction[]) => {
  let sum = 0
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType.Monthly) {
      sum += transaction.amount * 12
    } else {
      sum += transaction.amount
    }
  }
  return sum.toFixed(2)
}
