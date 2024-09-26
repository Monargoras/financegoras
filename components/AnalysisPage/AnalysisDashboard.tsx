'use client'

import { Flex } from '@mantine/core'
import { AnalysisDashboardData, Dictionary } from '@/utils/types'
import { TransactionTable } from '@/components/Dashboard/TransactionTable'
import CategoryEvolutionLineChart from './CategoryEvolutionLineChart'

interface AnalysisDashboardProps {
  locale: string
  dictionary: Dictionary
  data: AnalysisDashboardData
  demo: boolean
}

export default function AnalysisDashboard(props: AnalysisDashboardProps) {
  return (
    <Flex direction="column">
      <CategoryEvolutionLineChart data={props.data.categoryEvolutionData} colorMap={props.data.colorMap} />
      <TransactionTable
        dictionary={props.dictionary}
        demo={props.demo}
        data={props.data.transactions}
        categories={props.data.categories}
      />
    </Flex>
  )
}
