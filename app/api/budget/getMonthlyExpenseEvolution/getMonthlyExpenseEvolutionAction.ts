'use server'

import { getServerSession } from 'next-auth'
import { MonthlyExpenseEvolution } from '@/utils/types'
import { getMonthlyExpenseDataOneMonth, getMonthYearTuples } from './getMonthlyExpenseEvolutionUtils'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getMonthlyExpenseEvolution(
  userId: string,
  year: number,
  month: number | null,
  lang: string,
  includeSavings: boolean,
  grouped: boolean
): Promise<MonthlyExpenseEvolution> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return []
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getMonthlyExpenseDataOneMonth(m, y, includeSavings, validatedUserId, lang, grouped))
  )

  return expenses
}
