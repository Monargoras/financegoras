'use client'

import { Flex } from '@mantine/core'
import { AnalysisDashboardData, Dictionary } from '@/utils/types'
import { TransactionTable } from '@/components/Dashboard/TransactionTable'
import CategoryEvolutionLineChart from './CategoryEvolutionLineChart'
import StatsBoard from './StatsBoard'

interface AnalysisDashboardProps {
  locale: string
  dictionary: Dictionary
  data: AnalysisDashboardData
  demo: boolean
}

export default function AnalysisDashboard(props: AnalysisDashboardProps) {
  return (
    <Flex direction="row" gap="md" wrap="wrap-reverse" justify="center">
      <Flex direction="column" gap="md">
        <CategoryEvolutionLineChart data={props.data.categoryEvolutionData} colorMap={props.data.colorMap} />
        <TransactionTable
          dictionary={props.dictionary}
          demo={props.demo}
          data={props.data.transactions}
          categories={props.data.categories}
        />
      </Flex>
      <StatsBoard dict={props.dictionary} data={props.data.statsBoardData} />
    </Flex>
  )
}
