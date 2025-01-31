import { db } from '@/utils/database'
import { parseDatabaseTransactionsArray } from '@/utils/helpers'
import { getMonthYearTuples } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { TransactionType } from '@/utils/types'

const getIncomeAndExpenseTransactions = async (userId: string, year: number, month: number) => {
  const incomeRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', new Date(year, month, 1))
    .where((eb) => eb('stoppedAt', 'is', null).or('stoppedAt', '>=', new Date(year, month - 1, 1)))
    .where('isIncome', '=', true)
    .execute()

  const expenseRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', new Date(year, month, 1))
    .where((eb) => eb('stoppedAt', 'is', null).or('stoppedAt', '>=', new Date(year, month - 1, 1)))
    .where('isIncome', '=', false)
    .where('isSavings', '=', false)
    .execute()

  // transform transaction type to enum
  const incomeTransactions = parseDatabaseTransactionsArray(incomeRes)
  const expenseTransactions = parseDatabaseTransactionsArray(expenseRes)

  // filter out expenses with day of month greater than current day
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const filteredExpenseTransactions = expenseTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt)
    return transactionDate.getDate() <= currentDay
  })

  return { incomeTransactions, expenseTransactions: filteredExpenseTransactions }
}

export const getAverageExpensesToDayOfMonth = async (userId: string, year: number, month: number) => {
  const date = new Date(year, month, 1)
  // set date one month back, respect year change
  date.setMonth(date.getMonth() - 1)
  if (month === 1) {
    date.setFullYear(date.getFullYear() - 1)
  }
  const monthYearTuples = getMonthYearTuples(date.getMonth(), date.getFullYear())

  // holds tuples of expenses and percentage of income
  const resArray = []

  // get all income transaction per month
  for (const [m, y] of monthYearTuples) {
    const { incomeTransactions, expenseTransactions } = await getIncomeAndExpenseTransactions(userId, y, m)
    const totalIncome = incomeTransactions.reduce((acc, cur) => {
      if (cur.transactionType === TransactionType.Annual) {
        return acc + cur.amount / 12
      }
      return acc + cur.amount
    }, 0)
    const totalExpenses = expenseTransactions.reduce((acc, cur) => {
      if (cur.transactionType === TransactionType.Annual) {
        return acc + cur.amount / 12
      }
      return acc + cur.amount
    }, 0)
    const percentageOfIncome = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100
    resArray.push({ totalExpenses, percentageOfIncome })
  }

  // get average of expenses and percentage of income
  const totalExpenses = resArray.reduce((acc, res) => acc + res.totalExpenses, 0)
  const totalPercentageOfIncome = resArray.reduce((acc, res) => acc + res.percentageOfIncome, 0)
  const averageExpenses = totalExpenses / resArray.length
  const averagePercentageOfIncome = totalPercentageOfIncome / resArray.length

  return { averageExpenses, averagePercentageOfIncome }
}
