'use server'

import { getServerSession } from 'next-auth'
import { CategoryEvolutionLineChartData, Transaction } from '@/utils/types'
import {
  getCategoryEvolutionOneMonth,
  getDynamicMonthYearTuples,
} from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getUsedCategories from '../../budget/getCategories/getUsedCategoriesAction'
import { getTransactionsInMonth } from './analysisDashboardUtils'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getCategoryEvolution(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  lang: string,
  userId: string
): Promise<CategoryEvolutionLineChartData> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return []
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)
  const usedCategories = await getUsedCategories(validatedUserId, false)

  // get intersection of used categories and categories in transactions
  const filteredCategories = usedCategories
    ? usedCategories.filter((category) => transactions.some((transaction) => transaction.category === category))
    : []

  const series = await Promise.all(
    monthsToCompute.map(([m, y]) =>
      getCategoryEvolutionOneMonth(m, y, lang, getTransactionsInMonth(transactions, m, y), filteredCategories)
    )
  )

  return series
}
