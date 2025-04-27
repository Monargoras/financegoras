'use server'

import { CategoryAggregationData, TransactionDTO, TransactionType } from '@/utils/types'
import { getDynamicMonthYearTuples } from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { getTransactionsInMonth } from './analysisDashboardUtils'

const getStatsForCategory = (transactions: TransactionDTO[], monthsToCompute: number[][]) => {
  const totalsPerMonth = monthsToCompute.map(([m, y]) =>
    getTransactionsInMonth(transactions, m, y).reduce((acc, cur) => {
      if (cur.transactionType === TransactionType.Annual) {
        return acc + cur.amount / 12
      }
      return acc + cur.amount
    }, 0)
  )

  const total = totalsPerMonth.reduce((acc, cur) => acc + cur, 0)
  const average = total / totalsPerMonth.length
  const { id, category, isIncome, isSavings } = transactions[0]

  return { id, name: category, total, average, isIncome, isSavings }
}

export default async function getCategoryAggregationData(
  transactions: TransactionDTO[],
  startDate: Date,
  endDate: Date
): Promise<CategoryAggregationData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)

  const incomeTransactions = transactions.filter((transaction) => transaction.isIncome)
  const savingsTransactions = transactions.filter((transaction) => transaction.isSavings)
  const expensesTransactions = transactions.filter((transaction) => !transaction.isIncome && !transaction.isSavings)

  const incomeCategories = Array.from(new Set(incomeTransactions.map((transaction) => transaction.category)))
  const incomeData = incomeCategories.map((category) => {
    const catTransactions = incomeTransactions.filter((transaction) => transaction.category === category)
    return getStatsForCategory(catTransactions, monthsToCompute)
  })

  const savingsCategories = Array.from(new Set(savingsTransactions.map((transaction) => transaction.category)))
  const savingsData = savingsCategories.map((category) => {
    const catTransactions = savingsTransactions.filter((transaction) => transaction.category === category)
    return getStatsForCategory(catTransactions, monthsToCompute)
  })

  const expensesCategories = Array.from(new Set(expensesTransactions.map((transaction) => transaction.category)))
  const expensesData = expensesCategories.map((category) => {
    const catTransactions = expensesTransactions.filter((transaction) => transaction.category === category)
    return getStatsForCategory(catTransactions, monthsToCompute)
  })

  return [...expensesData, ...incomeData, ...savingsData].sort((a, b) => b.average - a.average)
}
