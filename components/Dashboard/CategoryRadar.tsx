'use client'

import { Flex, Loader, Text } from '@mantine/core'
import { RadarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { CategoryExpenseData, Dictionary } from '@/utils/types'

interface CategoryRadarProps {
  lang: string
  dictionary: Dictionary
  percentage: boolean
  includeSavings: boolean
  selectedMonth: number
}

export default function CategoryRadar(props: CategoryRadarProps) {
  const fetcher: Fetcher<CategoryExpenseData[], string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  // update selected year if month changes to month is larger than current month -> is in last year
  const selectedYear =
    props.selectedMonth > new Date().getMonth() + 1 ? new Date().getFullYear() - 1 : new Date().getFullYear()
  const params = `?year=${selectedYear}&month=${props.selectedMonth}&percentage=${props.percentage}&includeSavings=${props.includeSavings}`
  const { data, error, isLoading } = useSWR(`/api/budget/getExpensesByCategory${params}`, fetcher)

  return (
    <>
      {isLoading && (
        <>
          <Text style={{ visibility: 'hidden' }}>
            {new Date(`${selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
          </Text>
          <Flex justify="center" align="center" w={300} h={200}>
            <Loader color="blue" type="dots" />
          </Flex>
        </>
      )}
      {error && (
        <>
          <Text style={{ visibility: 'hidden' }}>
            {new Date(`${selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
          </Text>
          <Flex justify="center" align="center" w={300} h={200}>
            <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
          </Flex>
        </>
      )}
      {data && (
        <Flex direction="column" align="center">
          <Text>
            {new Date(`${selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
          </Text>
          <RadarChart
            w={300}
            h={200}
            data={data}
            dataKey="category"
            series={[{ name: 'value', color: 'blue.5', opacity: 0.2 }]}
          />
        </Flex>
      )}
    </>
  )
}