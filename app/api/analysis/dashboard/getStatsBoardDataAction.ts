'use server'

import { StatsBoardData, Transaction, TransactionType } from '@/utils/types'
import { getDynamicMonthYearTuples } from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import { getTransactionsInMonth } from './analysisDashboardUtils'

const getStats = (transactions: Transaction[], monthsToCompute: number[][]) => {
  const totalsPerMonth = monthsToCompute.map(([m, y]) =>
    getTransactionsInMonth(transactions, m, y).reduce((acc, cur) => {
      if (cur.transactionType === TransactionType.Annual) {
        return acc + cur.amount / 12
      }
      return acc + cur.amount
    }, 0)
  )

  const total = totalsPerMonth.reduce((acc, cur) => acc + cur, 0)
  const average = total / totalsPerMonth.length
  const maximum = Math.max(...totalsPerMonth)
  const minimum = Math.min(...totalsPerMonth)

  return {
    totalsPerMonth,
    total,
    average,
    maximum,
    minimum,
  }
}

export default async function getStatsBoardData(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Promise<StatsBoardData> {
  const monthsToCompute = getDynamicMonthYearTuples(startDate, endDate)

  const incomeTransactions = transactions.filter((transaction) => transaction.isIncome)
  const savingsTransactions = transactions.filter((transaction) => transaction.isSavings)
  const expensesTransactions = transactions.filter((transaction) => !transaction.isIncome && !transaction.isSavings)

  const income = getStats(incomeTransactions, monthsToCompute)
  const savings = getStats(savingsTransactions, monthsToCompute)
  const expenses = getStats(expensesTransactions, monthsToCompute)

  return {
    totalFiltered: {
      expenses: expenses.total,
      income: income.total,
      savings: savings.total,
    },
    averagePerMonth: {
      expenses: expenses.average,
      expensesPercentage: Math.round((expenses.average / income.average) * 100),
      income: income.average,
      incomePercentage: 100,
      savings: savings.average,
      savingsPercentage: Math.round((savings.average / income.average) * 100),
    },
    maximumOneMonth: {
      expenses: expenses.maximum,
      expensesPercentage: Math.round((expenses.maximum / income.average) * 100),
      income: income.maximum,
      incomePercentage: 100,
      savings: savings.maximum,
      savingsPercentage: Math.round((savings.maximum / income.average) * 100),
    },
    minimumOneMonth: {
      expenses: expenses.minimum,
      expensesPercentage: Math.round((expenses.minimum / income.average) * 100),
      income: income.minimum,
      incomePercentage: 100,
      savings: savings.minimum,
      savingsPercentage: Math.round((savings.minimum / income.average) * 100),
    },
  }
}
