'use server'

import { AggregatedIncomeExpenseEvolution } from '@/utils/types'
import { getIncExpOneMonth } from './getIncExpEvolutionUtils'
import { getMonthYearTuples } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { validateUserId } from '@/utils/authUtils'

export default async function getIncExpEvolution(
  userId: string,
  date: Date,
  lang: string
): Promise<AggregatedIncomeExpenseEvolution> {
  const validatedUserId = await validateUserId(userId)

  const monthsToCompute = getMonthYearTuples(date.getMonth() + 1, date.getFullYear())
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(monthsToCompute.map(([m, y]) => getIncExpOneMonth(m, y, validatedUserId, lang)))

  const fixedTypes = expenses.map((e) => ({
    month: e.month,
    totalIncome: parseFloat(e.totalIncome),
    totalExpenses: parseFloat(e.totalExpenses),
    totalSavings: parseFloat(e.totalSavings),
    remainingIncome: parseFloat(e.remainingIncome),
  }))

  // calculates the maximum percetnage of income used
  const maxPercentage =
    Math.max(
      ...fixedTypes.filter((e) => e.remainingIncome < 0).map((e) => Math.abs(e.remainingIncome) / e.totalIncome)
    ) + 1

  return {
    maxPercentageOfIncomeUsed: maxPercentage > 1 ? maxPercentage : 1,
    series: fixedTypes,
  }
}
