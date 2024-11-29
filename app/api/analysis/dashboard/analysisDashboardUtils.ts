import { Transaction } from '@/utils/types'

export function getTransactionsInMonth(transactions: Transaction[], month: number, year: number) {
  const curMonth = transactions.filter(
    (transaction) =>
      transaction.createdAt < new Date(year, month, 1) &&
      (transaction.stoppedAt === null || transaction.stoppedAt >= new Date(year, month - 1, 1))
  )
  return curMonth
}

export const emptyData = {
  categories: [],
  transactions: [],
  listOfNames: [],
  categoryEvolutionData: [],
  colorMap: {},
  statsBoardData: {
    totalFiltered: {
      expenses: 0,
      expensesPercentage: 0,
      income: 0,
      remainingIncome: 0,
      savings: 0,
      savingsPercentage: 0,
    },
    averagePerMonth: {
      expenses: 0,
      expensesPercentage: 0,
      income: 0,
      remainingIncome: 0,
      savings: 0,
      savingsPercentage: 0,
    },
    maximumOneMonth: {
      expenses: 0,
      expensesPercentage: 0,
      income: 0,
      remainingIncome: 0,
      savings: 0,
      savingsPercentage: 0,
    },
    minimumOneMonth: {
      expenses: 0,
      expensesPercentage: 0,
      income: 0,
      remainingIncome: 0,
      savings: 0,
      savingsPercentage: 0,
    },
  },
  categoryAggregationData: [],
}
