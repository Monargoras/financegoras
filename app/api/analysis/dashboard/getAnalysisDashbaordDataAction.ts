'use server'

import {
  AnalysisDashboardDTO,
  getGroupFromCategory,
  getTransactionType,
  TransactionDTO,
  TransactionType,
} from '@/utils/types'
import getCategoryEvolution from './getCategoryEvolutionAction'
import getAllTransactions from '../../transactions/getAllTransactions/getAllTransactionsAction'
import getCategories from '../../budget/getCategories/getCategoriesAction'
import getColorMap from '../../budget/getColorMap/getColorMapAction'
import getStatsBoardData from './getStatsBoardDataAction'
import getCategoryAggregationData from './getCategoryAggregationDataAction'
import { validateUserId } from '@/utils/authUtils'
import { emptyData } from './analysisDashboardUtils'

export default async function getAnalysisDashbaordData(
  userId: string,
  names: string[],
  categories: string[],
  groups: string[],
  types: string[],
  startDate: string | null,
  endDate: string | null,
  onlyExpenses: boolean,
  lang: string
): Promise<AnalysisDashboardDTO> {
  const validatedUserId = await validateUserId(userId)

  const [allCategories, allTransactions] = await Promise.all([getCategories(userId), getAllTransactions(userId)])

  const listOfNames = Array.from(new Set(allTransactions.map((ta) => ta.name)))

  const allIncomeTransactions = allTransactions.filter((ta) => ta.isIncome)
  const allSavingsTransactions = allTransactions.filter((ta) => ta.isSavings && !ta.isIncome)

  if (!allCategories) {
    return emptyData
  }

  const safeStartDate = new Date(startDate ?? allTransactions[allTransactions.length - 1].createdAt)
  const safeEndDate = new Date(endDate ?? allTransactions[0].createdAt)

  const filterData = (rawData: TransactionDTO[]) => {
    let res = rawData
    if (onlyExpenses) {
      res = res.filter((ta) => !ta.isIncome && !ta.isSavings)
    }
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
        const rangeEnd = new Date(safeEndDate.getTime() + 86400000)
        return createdAt < rangeEnd && (!stoppedAt || stoppedAt >= safeStartDate)
      })
    }
    return res
  }

  const filteredTransactions = filterData(allTransactions)

  const [categoryEvolution, colorMap, statsBoardData, categoryAggregationData] = await Promise.all([
    getCategoryEvolution(filteredTransactions, safeStartDate, safeEndDate, lang, validatedUserId),
    getColorMap(validatedUserId),
    getStatsBoardData(filteredTransactions, allIncomeTransactions, allSavingsTransactions, safeStartDate, safeEndDate),
    getCategoryAggregationData(filteredTransactions, safeStartDate, safeEndDate),
  ])

  return {
    categories: allCategories,
    transactions: filteredTransactions,
    listOfNames,
    categoryEvolutionData: categoryEvolution,
    colorMap,
    statsBoardData,
    categoryAggregationData,
  }
}
