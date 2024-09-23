'use client'

import { Flex } from '@mantine/core'
import { AnalysisDashboardData, Dictionary } from '@/utils/types'
import { TransactionTable } from '@/components/Dashboard/TransactionTable'

interface AnalysisDashboardProps {
  locale: string
  dictionary: Dictionary
  data: AnalysisDashboardData
  demo: boolean
}

export default function AnalysisDashboard(props: AnalysisDashboardProps) {
  return (
    <Flex direction="column">
      <TransactionTable
        dictionary={props.dictionary}
        demo={props.demo}
        data={props.data.transactions}
        categories={props.data.categories}
      />
    </Flex>
  )
}
