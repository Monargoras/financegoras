'use server'

import { AggregatedIncomeExpenseTotals } from '@/utils/types'
import { calculateTotalPerMonth, calculateTotalPerYear } from './calculateTotals'
import { fetchIncExpSavTransactions } from './fetchIncExpSavTransactions'

export default async function getMonthlyData(
  userId: string,
  year: number,
  month: number | null
): Promise<AggregatedIncomeExpenseTotals> {
  const { incomeTransactions, expenseTransactions, savingsTransactions } = await fetchIncExpSavTransactions(
    userId,
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

  return {
    totalIncome: parseFloat(totalIncome),
    totalExpenses: parseFloat(totalExpenses),
    totalSavings: parseFloat(totalSavings),
  }
}
