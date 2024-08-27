'use client'

import { Flex, Loader, Text } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { AggregatedIncomeExpenseEvolution, Dictionary } from '@/utils/types'
import { getMonthNameArray } from '@/utils/helpers'

interface AggregatedIncExpEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  setSelectedMonth: (month: number) => void
  selectedYear: number
  setSelectedYear: (year: number) => void
  timeframe: string
  demo: boolean
}

export default function AggregatedIncExpEvolutionGraph(props: AggregatedIncExpEvolutionGraphProps) {
  const fetcher: Fetcher<AggregatedIncomeExpenseEvolution, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const month = props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getMonth() + 1 : 12
  const year =
    props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getFullYear() : props.selectedYear
  const params = `?year=${year}&month=${month}&lang=${props.lang}&demo=${props.demo}`
  const { data, error, isLoading } = useSWR(`/api/budget/getIncExpEvolution${params}`, fetcher)

  return (
    <>
      {isLoading && (
        <Flex justify="center" align="center" w={900} h={280}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={900} h={280}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
      {data && (
        <AreaChart
          w={900}
          h={280}
          data={data}
          dataKey="month"
          legendProps={{ verticalAlign: 'bottom' }}
          series={[
            { name: 'totalIncome', label: props.dictionary.budgetPage.monthlyIncome, color: 'green.5' },
            { name: 'totalExpenses', label: props.dictionary.budgetPage.monthlyExpenses, color: 'red.5' },
            { name: 'totalSavings', label: props.dictionary.budgetPage.monthlySavings, color: 'blue.5' },
          ]}
          areaChartProps={{ syncId: 'month' }}
          activeDotProps={{
            onClick: (_event, payload) => {
              // get month number from name
              // @ts-expect-error payload is not typed in correctly by recharts, but does exist
              const selectedMonth = getMonthNameArray(props.lang).indexOf(payload.payload.month) + 1
              props.setSelectedMonth(selectedMonth)
              if (
                props.timeframe === props.dictionary.budgetPage.last12Months &&
                selectedMonth > new Date().getMonth() + 1
              ) {
                props.setSelectedYear(new Date().getFullYear() - 1)
              }
              if (
                props.timeframe === props.dictionary.budgetPage.last12Months &&
                selectedMonth < new Date().getMonth() + 1
              ) {
                props.setSelectedYear(new Date().getFullYear())
              }
            },
          }}
        />
      )}
    </>
  )
}
