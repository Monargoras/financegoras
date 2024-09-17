export type PageProps = {
  params: {
    lang: string
  }
}

export type Dictionary = {
  [key: string]: { [key: string]: string }
}

export const getTransactionType = (type: string): TransactionType => {
  switch (type) {
    case 'Single':
      return TransactionType.Single
    case 'Monthly':
      return TransactionType.Monthly
    case 'Annual':
      return TransactionType.Annual
    default:
      throw new Error(`Unknown transaction type: ${type}`)
  }
}

export enum TransactionType {
  Single,
  Monthly,
  Annual,
}

export type Transaction = {
  id: string
  isIncome: boolean
  isSavings: boolean
  amount: number
  createdAt: Date
  name: string
  category: string
  transactionType: TransactionType
  stoppedAt: Date | null
}

export type CategoryGroup = {
  group: string
  items: string[]
}

export type Categories = CategoryGroup[]

export type CategoryExpenseData = {
  category: string
  value: number
}

export type AggregatedIncomeExpenseTotals = {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
}

export type AggregatedIncomeExpenseEvolution = {
  month: string
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  remainingIncome: number
}[]

export type MonthlyExpense = {
  month: string
} & Record<string, number>

export type MonthlyExpenseEvolution = MonthlyExpense[]

export type DashboardData = {
  monthlyExpenseEvolution: MonthlyExpenseEvolution
  incExpEvolution: AggregatedIncomeExpenseEvolution
  monthlyStats: AggregatedIncomeExpenseTotals
  expensesByCategory: CategoryExpenseData[]
  transactions: Transaction[]
  categories: Categories | null
}
