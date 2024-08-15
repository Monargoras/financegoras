export type PageProps = {
  params: {
    lang: string
  }
}

export type Dictionary = {
  [key: string]: { [key: string]: string }
}

export enum TransactionType {
  Single,
  Monthly,
  Annual,
}

export type Transaction = {
  id: string
  isIncome: boolean
  amount: number
  createdAt: Date
  name: string
  category: string
  transactionType: TransactionType
  stoppedAt?: Date
}
