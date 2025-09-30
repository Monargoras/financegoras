import { DatabaseTransactionType, getTransactionType, TransactionDTO } from './types'

export const colorsHex = [
  '#868e96',
  '#fa5252',
  '#f783ac',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
]

export const getMonthNameArray = (lang: string) => {
  const monthNames = []
  for (let i = 0; i < 12; i += 1) {
    monthNames.push(new Date(2021, i, 1).toLocaleString(lang, { month: 'long' }))
  }
  return monthNames
}

export const parseDatabaseTransactionsArray = (transactions: DatabaseTransactionType[]): TransactionDTO[] =>
  transactions.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
    createdAt: transaction.createdAt.toUTCString(),
    stoppedAt: transaction.stoppedAt ? transaction.stoppedAt.toUTCString() : null,
  }))

export const sortAndDeduplicate = (strings: string[]): string[] => {
  const frequencyMap = new Map<string, number>()
  for (const str of strings) {
    frequencyMap.set(str, (frequencyMap.get(str) || 0) + 1)
  }
  // sort in descending order
  const uniqueStrings = Array.from(frequencyMap.keys())
  uniqueStrings.sort((a, b) => {
    const freqDiff = frequencyMap.get(b)! - frequencyMap.get(a)!
    return freqDiff !== 0 ? freqDiff : a.localeCompare(b) // fallback alphabetical
  })
  return uniqueStrings
}
