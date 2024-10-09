'use server'

import { CategoryEvolutionLineChartData, Transaction } from '@/utils/types'
import {
  getCategoryEvolutionOneMonth,
  getDynamicMonthYearTuples,
} from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getUsedCategories from '../../budget/getCategories/getUsedCategoriesAction'
import { getTransactionsInMonth } from './analysisDashboardUtils'

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
      getCategoryEvolutionOneMonth(m, y, lang, getTransactionsInMonth(transactions, m, y), filteredCategories)
    )
  )

  return expenses
}
