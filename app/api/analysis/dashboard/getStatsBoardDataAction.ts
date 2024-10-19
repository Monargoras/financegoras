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
    averagePercentage:
      Number.isNaN(averagePercentage) || !Number.isFinite(averagePercentage) ? undefined : averagePercentage,
    maximum,
    maximumPercentage:
      Number.isNaN(maximumPercentage) || !Number.isFinite(maximumPercentage) ? undefined : maximumPercentage,
    minimum,
    minimumPercentage:
      Number.isNaN(minimumPercentage) || !Number.isFinite(minimumPercentage) ? undefined : minimumPercentage,
  }
}

export default async function getStatsBoardData(
  transactions: Transaction[],
  allIncomeTransactions: Transaction[],
  allSavingsTransactions: Transaction[],
  startDate: Date,
  endDate: Date
): Promise<StatsBoardData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)

  const incomeTransactions = allIncomeTransactions
  const savingsTransactions = allSavingsTransactions
  const expensesTransactions = transactions.filter((transaction) => !transaction.isIncome && !transaction.isSavings)

  const income = getStats(incomeTransactions, monthsToCompute, undefined)
  const savings = getStats(savingsTransactions, monthsToCompute, income.totalsPerMonth)
  const expenses = getStats(expensesTransactions, monthsToCompute, income.totalsPerMonth)

  return {
    totalFiltered: {
      expenses: expenses.total,
      expensesPercentage: income.total ? (expenses.total / income.total) * 100 : 0,
      income: income.total,
      savings: savings.total,
      savingsPercentage: income.total ? (savings.total / income.total) * 100 : 0,
    },
    averagePerMonth: {
      expenses: expenses.average,
      expensesPercentage: expenses.averagePercentage || 0,
      income: income.average,
      savings: savings.average,
      savingsPercentage: savings.averagePercentage || 0,
    },
    maximumOneMonth: {
      expenses: expenses.maximum,
      expensesPercentage: expenses.maximumPercentage || 0,
      income: income.maximum,
      savings: savings.maximum,
      savingsPercentage: savings.maximumPercentage || 0,
    },
    minimumOneMonth: {
      expenses: expenses.minimum,
      expensesPercentage: expenses.minimumPercentage || 0,
      income: income.minimum,
      savings: savings.minimum,
      savingsPercentage: savings.minimumPercentage || 0,
    },
  }
}
