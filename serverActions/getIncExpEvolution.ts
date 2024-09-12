'use server'

import { getServerSession } from 'next-auth'
import { AggregatedIncomeExpenseEvolution } from '@/utils/types'
import { getIncExpOneMonth } from '@/utils/serverActions/getIncExpEvolutionUtils'
import { getMonthYearTuples } from '@/utils/serverActions/getMonthlyExpenseEvolutionUtils'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { demoUserId } from '@/utils/CONSTANTS'

export default async function getIncExpEvolution(
  year: number,
  month: number | null,
  lang: string,
  isDemo: boolean = false
): Promise<AggregatedIncomeExpenseEvolution | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && !isDemo) {
    return null
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(monthsToCompute.map(([m, y]) => getIncExpOneMonth(m, y, userId, lang)))

  const fixedTypes = expenses.map((e) => ({
    month: e.month,
    totalIncome: parseFloat(e.totalIncome),
    totalExpenses: parseFloat(e.totalExpenses),
    totalSavings: parseFloat(e.totalSavings),
    remainingIncome: parseFloat(e.remainingIncome),
  }))

  return fixedTypes
}
