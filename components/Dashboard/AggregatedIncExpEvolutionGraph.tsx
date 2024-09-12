'use client'

import { Flex, Loader, Text, useMatches } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { AggregatedIncomeExpenseEvolution, Dictionary } from '@/utils/types'
import { getMonthNameArray } from '@/utils/helpers'
import getIncExpEvolution from '@/serverActions/getIncExpEvolution'

interface AggregatedIncExpEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  setSelectedMonth: (month: number) => void
  selectedYear: number
  setSelectedYear: (year: number) => void
  timeframe: string
  percentage: boolean
  stackedChart: boolean
  demo: boolean
  initialData: AggregatedIncomeExpenseEvolution | null
}

export default function AggregatedIncExpEvolutionGraph(props: AggregatedIncExpEvolutionGraphProps) {
  const chartWidth = useMatches({
    md: 900,
    sm: 400,
  })

  const month = props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getMonth() + 1 : 12
  const year =
    props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getFullYear() : props.selectedYear
  const fetcher: Fetcher<AggregatedIncomeExpenseEvolution | null, string> = () =>
    getIncExpEvolution(year, month, props.lang, props.demo)
  const { data, error, isLoading } = useSWR('/api/budget/getIncExpEvolution', fetcher, {
    fallbackData: props.initialData,
  })

  return (
    <>
      {!data && isLoading && (
        <Flex justify="center" align="center" w={chartWidth} h={280}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={chartWidth} h={280}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
      {data && (
        <AreaChart
          w={chartWidth}
          h={280}
          data={data}
          dataKey="month"
          type={props.percentage ? 'percent' : props.stackedChart ? 'stacked' : 'default'}
          legendProps={{ verticalAlign: 'bottom' }}
          tooltipProps={{
            wrapperStyle: { zIndex: 1000 },
          }}
          yAxisProps={{
            // increased domain for standard chart because it sometimes overshot graph for some reason
            domain: ([dataMin, dataMax]) => [
              dataMin * 0,
              !props.stackedChart && !props.percentage ? Math.round(dataMax * 1.5) : Math.round(dataMax),
            ],
          }}
          series={[
            // remove total income for readability, replaced by remaining income
            // { name: 'totalIncome', label: props.dictionary.budgetPage.monthlyIncome, color: 'green.5' },
            { name: 'totalExpenses', label: props.dictionary.budgetPage.monthlyExpenses, color: 'red.5' },
            { name: 'totalSavings', label: props.dictionary.budgetPage.monthlySavings, color: 'blue.5' },
            { name: 'remainingIncome', label: props.dictionary.budgetPage.remainingIncome, color: 'cyan.5' },
          ]}
          valueFormatter={(value) => `${value.toFixed(2)}€`}
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
