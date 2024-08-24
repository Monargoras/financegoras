'use client'

import { Flex, Loader, Text } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { Dictionary, MonthlyExpenseEvolution } from '@/utils/types'
import { colorsHex, getMonthNameArray } from '@/utils/helpers'

interface MonthlyExpenseEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  percentage: boolean
  includeSavings: boolean
  setSelectedMonth: (month: number) => void
  selectedYear: number
  timeframe: string
}

export default function MonthlyExpenseEvolutionGraph(props: MonthlyExpenseEvolutionGraphProps) {
  const { lang } = props

  const fetcher: Fetcher<MonthlyExpenseEvolution, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const selMonth = props.timeframe === props.dictionary.budgetPage.last12Months ? new Date().getMonth() + 1 : 12
  const params = `?year=${props.selectedYear}&month=${selMonth}&includeSavings=${props.includeSavings}&lang=${lang}`
  const { data, error, isLoading } = useSWR(`/api/budget/getMonthlyExpenseEvolution${params}`, fetcher)

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
      {isLoading && (
        <Flex justify="center" align="center" w={900} h={200}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={900} h={200}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
      {data && (
        <BarChart
          w={900}
          h={200}
          data={data}
          dataKey="month"
          type={props.percentage ? 'percent' : 'stacked'}
          series={getSeries(data)}
          barChartProps={{ syncId: 'month' }}
          barProps={{
            onClick: (event) => {
              const { month } = event.payload
              // get month number from name
              const selectedMonth = getMonthNameArray(lang).indexOf(month) + 1
              props.setSelectedMonth(selectedMonth)
            },
          }}
        />
      )}
    </>
  )
}
