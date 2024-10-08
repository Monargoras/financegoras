'use server'

import { CategoryEvolutionLineChartData, Transaction } from '@/utils/types'
import {
  getCategoryEvolutionOneMonth,
  getDynamicMonthYearTuples,
} from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getUsedCategories from '../../budget/getCategories/getUsedCategoriesAction'

function getTransactionsInMonth(
  transactions: Transaction[],
  month: number,
  year: number,
  startDate: Date,
  endDate: Date
) {
  const curMonth = transactions.filter(
    (transaction) =>
      transaction.createdAt < new Date(year, month, 1) &&
      (transaction.stoppedAt === null || transaction.stoppedAt >= new Date(year, month - 1, 1))
  )
  // filter for exakt day if month and year are either the start or end date
  if (startDate.getMonth() + 1 === month && startDate.getFullYear() === year) {
    return curMonth.filter((transaction) => transaction.createdAt >= startDate)
  }
  if (endDate.getMonth() + 1 === month && endDate.getFullYear() === year) {
    return curMonth.filter((transaction) => transaction.createdAt <= endDate)
  }
  return curMonth
}

export default async function getCategoryEvolution(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  lang: string,
  userId: string
): Promise<CategoryEvolutionLineChartData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)
  const usedCategories = await getUsedCategories(userId, false)

  // get intersection of used categories and categories in transactions
  const filteredCategories = usedCategories
    ? usedCategories.filter((category) => transactions.some((transaction) => transaction.category === category))
    : []

  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) =>
      getCategoryEvolutionOneMonth(
        m,
        y,
        lang,
        getTransactionsInMonth(transactions, m, y, startDate, endDate),
        filteredCategories
      )
    )
  )

  return expenses
}
