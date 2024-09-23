import { db } from '@/utils/database'
import { getGroupFromCategory, getTransactionType, MonthlyExpense, Transaction, TransactionType } from '@/utils/types'
import getCategories from '../getCategories/getCategoriesAction'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../getAggregatedTransactions/calculateTotals'

export const getMonthlyExpenseDataOneMonth = async (
  month: number,
  year: number,
  includeSavings: boolean,
  userId: string,
  lang: string,
  grouped: boolean
) => {
  let expenseQuery = db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(year, month, 1) : new Date(year + 1, 0, 1))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or('stoppedAt', '>=', month ? new Date(year, month - 1, 1) : new Date(year, 0, 1))
    )
    .where('isIncome', '=', false)

  if (!includeSavings) {
    expenseQuery = expenseQuery.where('isSavings', '=', false)
  }

  const expenseRes = await expenseQuery.execute()

  const expenseTransactions: Transaction[] = expenseRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  let expensesPerGroupedSet = {} as Record<string, number>

  if (grouped) {
    const categories = await getCategories(userId)
    if (categories) {
      const groups = categories.map((cat) => cat.group)
      for (const group of groups) {
        const groupTransactions = expenseTransactions.filter(
          (transaction) => getGroupFromCategory(transaction.category, categories) === group
        )
        const totalGroup = month
          ? parseFloat(calculateTotalPerMonth(groupTransactions))
          : parseFloat(calculateTotalPerYear(groupTransactions, year))
        if (totalGroup > 0) expensesPerGroupedSet[group] = totalGroup
      }
    }
  } else {
    expensesPerGroupedSet = expenseTransactions.reduce(
      (acc, transaction) => {
        const { category } = transaction
        // timeframe month: annual transactions are divided by 12
        if (month && transaction.transactionType === TransactionType.Annual) {
          acc[category] = (acc[category] || 0) + transaction.amount / 12
          return acc
        }
        // timeframe year: monthly transactions are multiplied by 12
        if (!month && transaction.transactionType === TransactionType.Monthly) {
          acc[category] = (acc[category] || 0) + transaction.amount * 12
          return acc
        }
        acc[category] = (acc[category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>
    )
  }

  const expensesOneMonthArray = Object.entries(expensesPerGroupedSet).map(([category, total]) => ({
    [category]: total.toFixed(2),
  }))

  // transform array to object with all categories for the given month
  const expensesOneMonth = expensesOneMonthArray.reduce(
    (acc, obj) => {
      const key = Object.keys(obj)[0]
      acc[key] = parseFloat(obj[key])
      return acc
    },
    { month: new Date(`${year}-${month}-01`).toLocaleString(lang, { month: 'long' }) } as Record<
      string,
      number | string
    >
  )

  return expensesOneMonth as MonthlyExpense
}

export const getMonthYearTuples = (month: number | null, year: number) => {
  if (!month) {
    return [
      [1, year],
      [2, year],
      [3, year],
      [4, year],
      [5, year],
      [6, year],
      [7, year],
      [8, year],
      [9, year],
      [10, year],
      [11, year],
      [12, year],
    ]
  }
  const array = []
  for (let i = month; i > 0; i -= 1) {
    array.push([i, year])
  }
  let index = 0
  while (array.length < 12) {
    array.push([12 - index, year - 1])
    index += 1
  }
  return array.reverse()
}

export const valueToBoolean = (value: string | null) => {
  if (value === null) {
    return null
  }
  if (typeof value === 'boolean') {
    return value
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false
  }
  return null
}
