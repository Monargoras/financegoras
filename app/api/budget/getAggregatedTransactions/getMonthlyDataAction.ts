'use server'

import { AggregatedIncomeExpenseTotals } from '@/utils/types'
import { calculateTotalPerMonth, calculateTotalPerYear } from './calculateTotals'
import { fetchIncExpSavTransactions } from './fetchIncExpSavTransactions'
import { validateUserId } from '@/utils/authUtils'
import { getAverageExpensesToDayOfMonth } from './getAverageExpensesToDayOfMonth'

export default async function getMonthlyData(userId: string, date: Date): Promise<AggregatedIncomeExpenseTotals> {
  const validatedUserId = await validateUserId(userId)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const { incomeTransactions, expenseTransactions, savingsTransactions } = await fetchIncExpSavTransactions(
    validatedUserId,
    year,
    month
  )

  const totalIncome = month
    ? calculateTotalPerMonth(incomeTransactions)
    : calculateTotalPerYear(incomeTransactions, year)
  const totalExpenses = month
    ? calculateTotalPerMonth(expenseTransactions)
    : calculateTotalPerYear(expenseTransactions, year)
  const totalSavings = month
    ? calculateTotalPerMonth(savingsTransactions)
    : calculateTotalPerYear(savingsTransactions, year)

  const { averageExpenses, averagePercentageOfIncome } = await getAverageExpensesToDayOfMonth(
    validatedUserId,
    year,
    month ?? 12
  )

  return {
    totalIncome: parseFloat(totalIncome),
    totalExpenses: parseFloat(totalExpenses),
    totalSavings: parseFloat(totalSavings),
    averageExpensesToDate: averageExpenses,
    averagePercentageOfIncomeToDate: averagePercentageOfIncome,
  }
}
