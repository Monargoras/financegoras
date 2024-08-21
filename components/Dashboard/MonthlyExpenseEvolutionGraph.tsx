'use client'

import { useState } from 'react'
import { Flex, Loader, Switch, Text, useMantineTheme } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { Dictionary, MonthlyExpenseEvolution } from '@/utils/types'

interface MonthlyExpenseEvolutionGraphProps {
  dictionary: Dictionary
}

export default function MonthlyExpenseEvolutionGraph(props: MonthlyExpenseEvolutionGraphProps) {
  const theme = useMantineTheme()
  const [ofIncome, setOfIncome] = useState(true)
  const [percentage, setPercentage] = useState(true)

  const fetcher: Fetcher<MonthlyExpenseEvolution, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const { data, error, isLoading } = useSWR(
    `/api/budget/getMonthlyExpenseEvolution?year=${currentYear}&month=${currentMonth}&ofIncome=${ofIncome}&percentage=${percentage}`,
    fetcher
  )

  const getSeries = (d: MonthlyExpenseEvolution) => {
    const categorySet = new Set<string>()
    for (const month of d) {
      for (const category of Object.keys(month)) {
        categorySet.add(category)
      }
    }
    categorySet.delete('month')

    const res = Array.from(categorySet).map((category, index) => ({
      name: category,
      color: theme.colors[Object.keys(theme.colors)[index]][5],
    }))
    return res
  }

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>}
      {data && (
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
              checked={ofIncome}
              onChange={(event) => setOfIncome(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.ofIncome}
              offLabel={props.dictionary.budgetPage.ofExpenses}
              size="xl"
            />
          </Flex>
          <BarChart h={200} w={400} data={data} dataKey="category" type="stacked" series={getSeries(data)} />
        </Flex>
      )}
    </>
  )
}
