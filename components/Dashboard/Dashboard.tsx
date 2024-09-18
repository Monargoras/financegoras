'use client'

import { useState } from 'react'
import { Flex, Switch } from '@mantine/core'
import { DashboardData, Dictionary } from '@/utils/types'
import CategoryRadar from './CategoryRadar'
import MonthlyExpenseEvolutionGraph from './MonthlyExpenseEvolutionGraph'
import { MonthlyStats } from './MonthlyStats'
import { TransactionTable } from './TransactionTable'
import AggregatedIncExpEvolutionGraph from './AggregatedIncExpEvolutionGraph'
import TimeframeSelect from './TimeframeSelect'

interface DashboardProps {
  lang: string
  dictionary: Dictionary
  demo: boolean
  data: DashboardData
  grouped: boolean
  setGrouped: (grouped: boolean) => void
  includeSavings: boolean
  setIncludeSavings: (includeSavings: boolean) => void
  selectedMonth: number
  setSelectedMonth: (selectedMonth: number) => void
  selectedYear: number
  setSelectedYear: (selectedYear: number) => void
  timeframe: string
  setTimeframe: (timeframe: string) => void
  includeEmptyCategories: boolean
  setIncludeEmptyCategories: (includeEmptyCategories: boolean) => void
}

export default function Dashboard(props: DashboardProps) {
  const {
    data,
    grouped,
    setGrouped,
    includeSavings,
    setIncludeSavings,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    timeframe,
    setTimeframe,
    includeEmptyCategories,
    setIncludeEmptyCategories,
  } = props
  const [percentage, setPercentage] = useState(false)

  return (
    <Flex direction="column">
      <Flex direction="row" justify="center" align="center" gap="md" style={{ marginBottom: 8 }} wrap="wrap">
        <Switch
          checked={grouped}
          onChange={(event) => setGrouped(event.currentTarget.checked)}
          onLabel={props.dictionary.budgetPage.groups}
          offLabel={props.dictionary.budgetPage.categories}
          size="xl"
        />
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
        <TimeframeSelect
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
          dictionary={props.dictionary}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
        <Switch
          checked={includeEmptyCategories}
          onChange={(event) => setIncludeEmptyCategories(event.currentTarget.checked)}
          onLabel={props.dictionary.budgetPage.includeEmptyCategories}
          offLabel={props.dictionary.budgetPage.excludeEmptyCategories}
          label={props.dictionary.budgetPage.radarChart}
          labelPosition="left"
          size="xl"
        />
      </Flex>
      <Flex direction="row" justify="center" align="center" gap="md" wrap="wrap">
        <MonthlyExpenseEvolutionGraph
          lang={props.lang}
          dictionary={props.dictionary}
          percentage={percentage}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
          timeframe={timeframe}
          data={data.monthlyExpenseEvolution}
        />
        <CategoryRadar
          lang={props.lang}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          data={data.expensesByCategory}
        />
      </Flex>
      <Flex gap="md" justify="center" direction="row" wrap="wrap">
        <Flex gap="md" align="center" direction="column" wrap="wrap">
          <MonthlyStats dictionary={props.dictionary} data={data.monthlyStats} />
          <AggregatedIncExpEvolutionGraph
            lang={props.lang}
            dictionary={props.dictionary}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            timeframe={timeframe}
            percentage={percentage}
            data={data.incExpEvolution}
          />
        </Flex>
        <TransactionTable
          dictionary={props.dictionary}
          demo={props.demo}
          data={data.transactions}
          categories={data.categories}
        />
      </Flex>
    </Flex>
  )
}
