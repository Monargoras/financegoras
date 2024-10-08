'use server'

import {
  AnalysisDashboardData,
  getGroupFromCategory,
  getTransactionType,
  Transaction,
  TransactionType,
} from '@/utils/types'
import getCategoryEvolution from './getCategoryEvolutionAction'
import getAllTransactions from '../../transactions/getAllTransactions/getAllTransactionsAction'
import getCategories from '../../budget/getCategories/getCategoriesAction'
import getColorMap from '../../budget/getColorMap/getColorMapAction'

export default async function getAnalysisDashbaordData(
  userId: string,
  names: string[],
  categories: string[],
  groups: string[],
  types: string[],
  startDate: Date | null,
  endDate: Date | null,
  lang: string
): Promise<AnalysisDashboardData | null> {
  const [allCategories, allTransactions] = await Promise.all([getCategories(userId), getAllTransactions(userId)])

  const listOfNames = Array.from(new Set(allTransactions.map((ta) => ta.name)))

  if (!allCategories) {
    return null
  }

  const saveStartDate = startDate ?? allTransactions[allTransactions.length - 1].createdAt
  const saveEndDate = endDate ?? allTransactions[0].createdAt

  const filterData = (rawData: Transaction[]) => {
    let res = rawData
    if (names.length > 0) {
      res = res.filter((ta) => names.includes(ta.name))
    }
    if (categories.length > 0) {
      res = res.filter((ta) => categories.includes(ta.category))
    }
    if (groups.length > 0) {
      res = res.filter((ta) => groups.includes(getGroupFromCategory(ta.category, allCategories)))
    }
    if (types.length > 0) {
      res = res.filter((ta) =>
        types.map((el) => TransactionType[getTransactionType(el)]).includes(TransactionType[ta.transactionType])
      )
    }
    if (startDate && endDate) {
      res = res.filter((ta) => {
        const createdAt = new Date(ta.createdAt)
        const stoppedAt = ta.stoppedAt ? new Date(ta.stoppedAt) : null
        // add 24 hours to the end date to include the whole day
        const rangeEnd = new Date(endDate.getTime() + 86400000)
        return createdAt < rangeEnd && (!stoppedAt || stoppedAt >= startDate)
      })
    }
    return res
  }

  const filteredTransactions = filterData(allTransactions)

  const [categoryEvolution, colorMap] = await Promise.all([
    getCategoryEvolution(filteredTransactions, saveStartDate, saveEndDate, lang, userId),
    getColorMap(userId),
  ])

  return {
    categories: allCategories,
    transactions: filteredTransactions,
    listOfNames,
    categoryEvolutionData: categoryEvolution,
    colorMap,
  }
}
