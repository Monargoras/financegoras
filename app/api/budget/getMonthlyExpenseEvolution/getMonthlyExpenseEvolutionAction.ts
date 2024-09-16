'use server'

import { MonthlyExpenseEvolution } from '@/utils/types'
import { getMonthlyExpenseDataOneMonth, getMonthYearTuples } from './getMonthlyExpenseEvolutionUtils'

export default async function getMonthlyExpenseEvolution(
  userId: string,
  year: number,
  month: number | null,
  lang: string,
  includeSavings: boolean,
  grouped: boolean
): Promise<MonthlyExpenseEvolution> {
  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getMonthlyExpenseDataOneMonth(m, y, includeSavings, userId, lang, grouped))
  )

  return expenses
}
