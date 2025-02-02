'use server'

import { MonthlyExpenseEvolution } from '@/utils/types'
import { getMonthlyExpenseDataOneMonth, getMonthYearTuples } from './getMonthlyExpenseEvolutionUtils'
import { validateUserId } from '@/utils/authUtils'

export default async function getMonthlyExpenseEvolution(
  userId: string,
  date: Date,
  lang: string,
  includeSavings: boolean,
  grouped: boolean
): Promise<MonthlyExpenseEvolution> {
  const validatedUserId = await validateUserId(userId)

  const monthsToCompute = getMonthYearTuples(date.getMonth() + 1, date.getFullYear())
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getMonthlyExpenseDataOneMonth(m, y, includeSavings, validatedUserId, lang, grouped))
  )

  return expenses
}
