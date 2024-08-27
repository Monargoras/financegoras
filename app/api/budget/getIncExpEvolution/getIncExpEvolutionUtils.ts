import { fetchIncExpSavTransactions } from '../getAggregatedTransactions/fetchIncExpSavTransactions'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../getAggregatedTransactions/calculateTotals'

export const getIncExpOneMonth = async (month: number, year: number, userId: string, lang: string) => {
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
  const remainingIncome = (parseFloat(totalIncome) - parseFloat(totalExpenses) - parseFloat(totalSavings)).toFixed(2)

  return {
    month: new Date(`${year}-${month}-01`).toLocaleString(lang, { month: 'long' }),
    totalIncome,
    totalExpenses,
    totalSavings,
    remainingIncome,
  }
}
