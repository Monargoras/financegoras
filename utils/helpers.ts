import { DatabaseTransactionType, getTransactionType, Transaction } from './types'

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

export const parseDatabaseTransactionsArray = (transactions: DatabaseTransactionType[]): Transaction[] =>
  transactions.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))
