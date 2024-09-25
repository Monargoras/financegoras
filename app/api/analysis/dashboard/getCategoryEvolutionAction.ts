'use server'

import { CategoryEvolutionLineChartData, Transaction } from '@/utils/types'
import {
  getCategoryEvolutionOneMonth,
  getDynamicMonthYearTuples,
} from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'

function getTransactionsInMonth(transactions: Transaction[], month: number, year: number): Transaction[] {
  return transactions.filter(
    (transaction) =>
      new Date(transaction.createdAt).getMonth() + 1 === month && new Date(transaction.createdAt).getFullYear() === year
  )
}

export default async function getCategoryEvolution(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  lang: string
): Promise<CategoryEvolutionLineChartData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) =>
      getCategoryEvolutionOneMonth(m, y, lang, getTransactionsInMonth(transactions, m, y))
    )
  )

  return expenses
}
