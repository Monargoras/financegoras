'use server'

import { StatsBoardData, Transaction, TransactionType } from '@/utils/types'
import { getDynamicMonthYearTuples } from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { getTransactionsInMonth } from './analysisDashboardUtils'

const getStats = (transactions: Transaction[], monthsToCompute: number[][], incomeValues: number[] | undefined) => {
  const totalsPerMonth = monthsToCompute.map(([m, y]) =>
    getTransactionsInMonth(transactions, m, y).reduce((acc, cur) => {
      if (cur.transactionType === TransactionType.Annual) {
        return acc + cur.amount / 12
      }
      return acc + cur.amount
    }, 0)
  )

  const total = totalsPerMonth.reduce((acc, cur) => acc + cur, 0)
  const percentages = incomeValues ? totalsPerMonth.map((value, index) => (value / incomeValues[index]) * 100) : []
  const average = total / totalsPerMonth.length
  const averagePercentage = percentages.reduce((acc, cur) => acc + cur, 0) / percentages.length
  const maximum = Math.max(...totalsPerMonth)
  const maximumPercentage = Math.max(...percentages)
  const minimum = Math.min(...totalsPerMonth)
  const minimumPercentage = Math.min(...percentages)

  return {
    totalsPerMonth,
    total,
    average,
    averagePercentage,
    maximum,
    maximumPercentage,
    minimum,
    minimumPercentage,
  }
}

export default async function getStatsBoardData(
  transactions: Transaction[],
  allIncomeTransactions: Transaction[],
  startDate: Date,
  endDate: Date
): Promise<StatsBoardData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)

  const incomeTransactions = allIncomeTransactions
  const savingsTransactions = transactions.filter((transaction) => transaction.isSavings)
  const expensesTransactions = transactions.filter((transaction) => !transaction.isIncome && !transaction.isSavings)

  const income = getStats(incomeTransactions, monthsToCompute, undefined)
  const savings = getStats(savingsTransactions, monthsToCompute, income.totalsPerMonth)
  const expenses = getStats(expensesTransactions, monthsToCompute, income.totalsPerMonth)

  return {
    totalFiltered: {
      expenses: expenses.total,
      income: income.total,
      savings: savings.total,
    },
    averagePerMonth: {
      expenses: expenses.average,
      expensesPercentage: expenses.averagePercentage,
      income: income.average,
      savings: savings.average,
      savingsPercentage: savings.averagePercentage,
    },
    maximumOneMonth: {
      expenses: expenses.maximum,
      expensesPercentage: expenses.maximumPercentage,
      income: income.maximum,
      savings: savings.maximum,
      savingsPercentage: savings.maximumPercentage,
    },
    minimumOneMonth: {
      expenses: expenses.minimum,
      expensesPercentage: expenses.minimumPercentage,
      income: income.minimum,
      savings: savings.minimum,
      savingsPercentage: savings.minimumPercentage,
    },
  }
}
