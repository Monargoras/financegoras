'use server'

import { db } from '@/utils/database'
import { CategoryExpenseData, getTransactionType, Transaction } from '@/utils/types'
import { calculateTotalPerMonth, calculateTotalPerYear } from '../getAggregatedTransactions/calculateTotals'
import getCategories from '../getCategories/getCategoriesAction'
import { getGroupFromCategory } from '../getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getUsedCategories from '../getCategories/getUsedCategoriesAction'

export default async function getExpensesByCategory(
  userId: string,
  year: number,
  month: number | null,
  includeSavings: boolean,
  grouped: boolean,
  includeEmptyCategories: boolean
): Promise<CategoryExpenseData[]> {
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

  // transform transaction type to enum
  const expenseTransactions: Transaction[] = expenseRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const aggregatedTransactions = {} as Record<string, number>
  const categories = await getCategories(userId)
  const usedCategories = await getUsedCategories(userId, includeSavings)

  if (grouped) {
    if (categories && usedCategories) {
      const groups = categories.map((cat) => cat.group)
      for (const group of groups) {
        // check if any item in the group is in the used categories
        if (categories[groups.indexOf(group)].items.some((item) => usedCategories.includes(item))) {
          const groupTransactions = expenseTransactions.filter(
            (transaction) => getGroupFromCategory(transaction.category, categories) === group
          )
          const totalGroup = month
            ? parseFloat(calculateTotalPerMonth(groupTransactions))
            : parseFloat(calculateTotalPerYear(groupTransactions, year))
          if (totalGroup > 0 || includeEmptyCategories) {
            aggregatedTransactions[group] = totalGroup
          }
        }
      }
    }
  } else if (categories && usedCategories) {
    for (const group of categories) {
      for (const category of group.items) {
        if (usedCategories.includes(category)) {
          const categoryTransactions = expenseTransactions.filter((transaction) => transaction.category === category)
          const totalCategory = month
            ? parseFloat(calculateTotalPerMonth(categoryTransactions))
            : parseFloat(calculateTotalPerYear(categoryTransactions, year))
          if (totalCategory > 0 || includeEmptyCategories) {
            aggregatedTransactions[category] = totalCategory
          }
        }
      }
    }
  }

  if (categories && usedCategories) {
    const groups = categories.map((cat) => cat.group)
    // get the rest of the categories that were deleted but still have transactions
    const restCategories = usedCategories.filter(
      (category) => !groups.some((group) => categories[groups.indexOf(group)].items.includes(category))
    )
    // add these as their own group or category no matter the grouping
    for (const category of restCategories) {
      const categoryTransactions = expenseTransactions.filter((transaction) => transaction.category === category)
      const totalCategory = month
        ? parseFloat(calculateTotalPerMonth(categoryTransactions))
        : parseFloat(calculateTotalPerYear(categoryTransactions, year))
      if (totalCategory > 0 || includeEmptyCategories) {
        aggregatedTransactions[category] = totalCategory
      }
    }
  }

  const totalExpense = month
    ? parseFloat(calculateTotalPerMonth(expenseTransactions))
    : parseFloat(calculateTotalPerYear(expenseTransactions, year))

  const expenses = Object.entries(aggregatedTransactions).map(([category, total]) => ({
    category,
    value: parseFloat(((total / totalExpense) * 100).toFixed(2)),
  }))

  return expenses
}
