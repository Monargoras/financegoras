'use client'

import { useState } from 'react'
import { Flex, Switch } from '@mantine/core'
import { Dictionary } from '@/utils/types'
import CategoryRadar from './CategoryRadar'
import MonthlyExpenseEvolutionGraph from './MonthlyExpenseEvolutionGraph'
import { MonthlyStats } from './MonthlyStats'
import { TransactionTable } from '../TransactionTable/TransactionTable'

interface DashboardProps {
  lang: string
  dictionary: Dictionary
}

export default function Dashboard(props: DashboardProps) {
  const [percentage, setPercentage] = useState(false)
  const [includeSavings, setIncludeSavings] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  return (
    <Flex direction="column">
      <Flex direction="row" justify="center" align="center" gap="md" style={{ marginBottom: 8 }}>
        <Switch
          checked={percentage}
          onChange={(event) => setPercentage(event.currentTarget.checked)}
          onLabel={props.dictionary.budgetPage.percentage}
          offLabel={props.dictionary.budgetPage.sum}
          size="xl"
        />
        <Switch
          checked={includeSavings}
          onChange={(event) => setIncludeSavings(event.currentTarget.checked)}
          onLabel={props.dictionary.budgetPage.includeSavings}
          offLabel={props.dictionary.budgetPage.excludeSavings}
          size="xl"
        />
      </Flex>
      <Flex direction="row" justify="center" align="center" gap="md">
        <MonthlyExpenseEvolutionGraph
          lang={props.lang}
          dictionary={props.dictionary}
          percentage={percentage}
          includeSavings={includeSavings}
          setSelectedMonth={setSelectedMonth}
        />
        <CategoryRadar
          lang={props.lang}
          dictionary={props.dictionary}
          percentage={percentage}
          includeSavings={includeSavings}
          selectedMonth={selectedMonth}
        />
      </Flex>
      <Flex gap="md" direction="row" justify="space-between" wrap="wrap">
        <Flex gap="md" direction="column">
          <MonthlyStats dictionary={props.dictionary} selectedMonth={selectedMonth} />
        </Flex>
        <TransactionTable dictionary={props.dictionary} selectedMonth={selectedMonth} />
      </Flex>
    </Flex>
  )
}
