'use client'

import { Flex, Loader, Text, useMatches } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { Dictionary, MonthlyExpenseEvolution } from '@/utils/types'
import { colorsHex, getMonthNameArray } from '@/utils/helpers'
import getMonthlyExpenseEvolution from '@/serverActions/getMonthlyExpenseEvolution'

interface MonthlyExpenseEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  percentage: boolean
  includeSavings: boolean
  setSelectedMonth: (month: number) => void
  selectedYear: number
  setSelectedYear: (year: number) => void
  stackedChart: boolean
  timeframe: string
  demo: boolean
  initialData: MonthlyExpenseEvolution | null
}

export default function MonthlyExpenseEvolutionGraph(props: MonthlyExpenseEvolutionGraphProps) {
  const chartWidth = useMatches({
    md: 900,
    sm: 400,
  })

  const selMonth = props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getMonth() + 1 : 12
  const year =
    props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getFullYear() : props.selectedYear
  const fetcher: Fetcher<MonthlyExpenseEvolution | null, string> = () =>
    getMonthlyExpenseEvolution(year, selMonth, props.lang, props.includeSavings, props.demo)
  const { data, error, isLoading } = useSWR('/api/budget/getMonthlyExpenseEvolution', fetcher, {
    fallbackData: props.initialData,
  })

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
      color: colorsHex[index],
    }))
    return res
  }

  return (
    <>
      {!data && isLoading && (
        <Flex justify="center" align="center" w={chartWidth} h={200}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={chartWidth} h={200}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
      {data && (
        <BarChart
          w={chartWidth}
          h={200}
          data={data}
          dataKey="month"
          type={props.percentage ? 'percent' : props.stackedChart ? 'stacked' : 'default'}
          series={getSeries(data)}
          valueFormatter={(value) => `${value.toFixed(2)}€`}
          barChartProps={{
            barGap: 1,
            barCategoryGap: props.stackedChart || props.percentage ? 5 : 10,
          }}
          tooltipProps={{
            wrapperStyle: { zIndex: 1000 },
          }}
          barProps={{
            onClick: (event) => {
              const { month } = event.payload
              // get month number from name
              const selectedMonth = getMonthNameArray(props.lang).indexOf(month) + 1
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
