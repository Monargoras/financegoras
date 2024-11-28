'use server'

import { getServerSession } from 'next-auth'
import { AggregatedIncomeExpenseTotals } from '@/utils/types'
import { calculateTotalPerMonth, calculateTotalPerYear } from './calculateTotals'
import { fetchIncExpSavTransactions } from './fetchIncExpSavTransactions'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getMonthlyData(
  userId: string,
  year: number,
  month: number | null
): Promise<AggregatedIncomeExpenseTotals> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
    }
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

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

  return {
    totalIncome: parseFloat(totalIncome),
    totalExpenses: parseFloat(totalExpenses),
    totalSavings: parseFloat(totalSavings),
  }
}
