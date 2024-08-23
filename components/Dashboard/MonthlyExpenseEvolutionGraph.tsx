'use client'

import { Flex, Loader, Text } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { Dictionary, MonthlyExpenseEvolution } from '@/utils/types'

interface MonthlyExpenseEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  percentage: boolean
  includeSavings: boolean
  setSelectedMonth: (month: number) => void
}

const colorsHex = [
  '#FFC312',
  '#C4E538',
  '#12CBC4',
  '#FDA7DF',
  '#ED4C67',
  '#F79F1F',
  '#A3CB38',
  '#1289A7',
  '#D980FA',
  '#B53471',
  '#EE5A24',
  '#009432',
  '#0652DD',
  '#9980FA',
  '#833471',
  '#EA2027',
  '#006266',
  '#1B1464',
  '#5758BB',
  '#6F1E51',
]

export default function MonthlyExpenseEvolutionGraph(props: MonthlyExpenseEvolutionGraphProps) {
  const { lang } = props

  const fetcher: Fetcher<MonthlyExpenseEvolution, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()
  const params = `?year=${curYear}&month=${curMonth}&includeSavings=${props.includeSavings}&lang=${lang}`
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
          barProps={{
            onClick: (event) => {
              const { month } = event.payload
              // get month number from name
              const selectedMonth = new Date(Date.parse(`01-${month}`)).getMonth() + 1
              props.setSelectedMonth(selectedMonth)
            },
          }}
        />
      )}
    </>
  )
}
