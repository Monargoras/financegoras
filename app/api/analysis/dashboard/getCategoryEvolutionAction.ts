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
      new Date(transaction.createdAt).getMonth() + 1 === month && new Date(transaction.createdAt).getFullYear() === year
  )
  // filter for exakt day if month and year are either the start or end date
  if (startDate.getMonth() + 1 === month && startDate.getFullYear() === year) {
    return curMonth.filter((transaction) => new Date(transaction.createdAt) >= startDate)
  }
  if (endDate.getMonth() + 1 === month && endDate.getFullYear() === year) {
    return curMonth.filter((transaction) => new Date(transaction.createdAt) <= endDate)
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

  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) =>
      getCategoryEvolutionOneMonth(
        m,
        y,
        lang,
        getTransactionsInMonth(transactions, m, y, startDate, endDate),
        usedCategories
      )
    )
  )

  return expenses
}
