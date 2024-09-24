'use server'

import { CategoryEvolutionLineChartData, Transaction } from '@/utils/types'
import {
  getCategoryEvolutionOneMonth,
  getDynamicMonthYearTuples,
} from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'

export default async function getCategoryEvolution(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  lang: string
): Promise<CategoryEvolutionLineChartData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getCategoryEvolutionOneMonth(m, y, lang, transactions))
  )

  return expenses
}
