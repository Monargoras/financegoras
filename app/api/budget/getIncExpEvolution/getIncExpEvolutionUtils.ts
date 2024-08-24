import { fetchIncExpSavTransactions } from '../getAggregatedTransactions/fetchIncExpSavTransactions'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../getAggregatedTransactions/calculateTotals'

export const getIncExpOneMonth = async (month: number, year: number, userId: string, lang: string) => {
  const { incomeTransactions, expenseTransactions, savingsTransactions } = await fetchIncExpSavTransactions(
    userId,
    year,
    month
  )

  const totalIncome = month ? calculateTotalPerMonth(incomeTransactions) : calculateTotalPerYear(incomeTransactions)
  const totalExpenses = month ? calculateTotalPerMonth(expenseTransactions) : calculateTotalPerYear(expenseTransactions)
  const totalSavings = month ? calculateTotalPerMonth(savingsTransactions) : calculateTotalPerYear(savingsTransactions)

  return {
    month: new Date(`${year}-${month}-01`).toLocaleString(lang, { month: 'long' }),
    totalIncome,
    totalExpenses,
    totalSavings,
  }
}
