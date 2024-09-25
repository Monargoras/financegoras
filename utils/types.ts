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

export type Category = {
  name: string
  color: string
}

export type CategoryGroup = {
  group: string
  color: string
  items: Category[]
}

export type Categories = CategoryGroup[]

export type CategoryExpenseData = {
  category: string
  value: number
}

export const getGroupFromCategory = (category: string, categories: Categories): string => {
  const categoryData = categories.find((cat) => cat.items.some((item) => item.name === category))
  return categoryData?.group || '-'
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

export type ColorMap = {
  [key: string]: string
}

export type MonthlyExpense = {
  month: string
} & Record<string, number>

export type MonthlyExpenseEvolution = MonthlyExpense[]

export type CategorySankeyData = {
  nodes: { name: string; type: 'savings' | 'income' | 'expenses' }[]
  links: { source: number; target: number; value: number; type: 'savings' | 'income' | 'expenses' }[]
}

export type UserSettings = {
  grouped: boolean
  percentage: boolean
  includeSavings: boolean
  includeEmptyCategories: boolean
}

export type DashboardData = {
  monthlyExpenseEvolution: MonthlyExpenseEvolution
  incExpEvolution: AggregatedIncomeExpenseEvolution
  monthlyStats: AggregatedIncomeExpenseTotals
  expensesByCategory: CategoryExpenseData[]
  transactions: Transaction[]
  categories: Categories | null
  settings: UserSettings
  colorMap: ColorMap
}

export type CategoryEvolution = {
  month: string
} & Record<string, number>

export type CategoryEvolutionLineChartData = CategoryEvolution[]

export type AnalysisDashboardData = {
  categories: Categories | null
  transactions: Transaction[]
  listOfNames: string[]
  categoryEvolutionData: CategoryEvolutionLineChartData
}
