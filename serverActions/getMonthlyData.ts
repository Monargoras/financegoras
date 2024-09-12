'use server'

import { getServerSession } from 'next-auth'
import { AggregatedIncomeExpenseTotals } from '@/utils/types'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../utils/calculateTotals'
import { fetchIncExpSavTransactions } from '../utils/fetchIncExpSavTransactions'
import { authOptions } from '../app/api/auth/[...nextauth]/authOptions'
import { demoUserId } from '@/utils/CONSTANTS'

export default async function getMonthlyData(
  year: number,
  month: number | null,
  isDemo: boolean = false
): Promise<AggregatedIncomeExpenseTotals | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && !isDemo) {
    return null
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

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
