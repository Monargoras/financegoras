'use client'

import { Flex } from '@mantine/core'
import { AnalysisDashboardData, Dictionary, StatsBoardData } from '@/utils/types'
import { TransactionTable } from '@/components/Dashboard/TransactionTable'
import CategoryEvolutionLineChart from './CategoryEvolutionLineChart'
import StatsBoard from './StatsBoard'

interface AnalysisDashboardProps {
  locale: string
  dictionary: Dictionary
  data: AnalysisDashboardData
  demo: boolean
}

const mockData: StatsBoardData = {
  totalFiltered: {
    expenses: 10234.54,
    income: 23945.98,
    savings: 3456.78,
  },
  averagePerMonth: {
    expenses: 735.45,
    expensesPercentage: 27,
    income: 2394.59,
    incomePercentage: 154,
    savings: 345.67,
    savingsPercentage: 12,
  },
  maximumOneMonth: {
    expenses: 2134.54,
    expensesPercentage: 27,
    income: 2775.98,
    incomePercentage: 154,
    savings: 3456.78,
    savingsPercentage: 12,
  },
  minimumOneMonth: {
    expenses: 0,
    expensesPercentage: 0,
    income: 0,
    incomePercentage: 0,
    savings: 0,
    savingsPercentage: 0,
  },
}

export default function AnalysisDashboard(props: AnalysisDashboardProps) {
  return (
    <Flex direction="row" gap="md" wrap="wrap-reverse">
      <Flex direction="column" gap="md" miw={400}>
        <CategoryEvolutionLineChart data={props.data.categoryEvolutionData} colorMap={props.data.colorMap} />
        <TransactionTable
          dictionary={props.dictionary}
          demo={props.demo}
          data={props.data.transactions}
          categories={props.data.categories}
        />
      </Flex>
      <StatsBoard dict={props.dictionary} data={mockData} />
    </Flex>
  )
}
