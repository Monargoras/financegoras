'use server'

import { getServerSession } from 'next-auth'
import { MonthlyExpenseEvolution } from '@/utils/types'
import {
  getMonthlyExpenseDataOneMonth,
  getMonthYearTuples,
} from '@/utils/serverActions/getMonthlyExpenseEvolutionUtils'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { demoUserId } from '@/utils/CONSTANTS'

export default async function getMonthlyExpenseEvolution(
  year: number,
  month: number | null,
  lang: string,
  includeSavings: boolean,
  isDemo: boolean = false
): Promise<MonthlyExpenseEvolution | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && !isDemo) {
    return null
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getMonthlyExpenseDataOneMonth(m, y, includeSavings, userId, lang))
  )

  return expenses
}
