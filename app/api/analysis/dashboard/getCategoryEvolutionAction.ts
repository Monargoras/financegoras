'use server'

import { CategoryEvolutionLineChartData, Transaction } from '@/utils/types'
import {
  getCategoryEvolutionOneMonth,
  getDynamicMonthYearTuples,
} from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getUsedCategories from '../../budget/getCategories/getUsedCategoriesAction'
import { getTransactionsInMonth } from './analysisDashboardUtils'
import { validateUserId } from '@/utils/authUtils'

export default async function getCategoryEvolution(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  lang: string,
  userId: string
): Promise<CategoryEvolutionLineChartData> {
  const validatedUserId = await validateUserId(userId)

  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)
  const usedCategories = await getUsedCategories(validatedUserId, false)

  // get intersection of used categories and categories in transactions
  const filteredCategories = usedCategories
    ? usedCategories.filter((category) => transactions.some((transaction) => transaction.category === category))
    : []

  const series = await Promise.all(
    monthsToCompute.map(([m, y]) =>
      getCategoryEvolutionOneMonth(m, y, lang, getTransactionsInMonth(transactions, m, y), filteredCategories)
    )
  )

  return series
}
