'use client'

import { Flex, Loader, Text } from '@mantine/core'
import { RadarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { CategoryExpenseData, Dictionary } from '@/utils/types'

interface CategoryRadarProps {
  lang: string
  dictionary: Dictionary
  includeSavings: boolean
  selectedMonth: number
  selectedYear: number
  demo: boolean
  initialData: CategoryExpenseData[]
}

export default function CategoryRadar(props: CategoryRadarProps) {
  const fetcher: Fetcher<CategoryExpenseData[], string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const params = `?year=${props.selectedYear}&month=${props.selectedMonth}&includeSavings=${props.includeSavings}&demo=${props.demo}`
  const { data, error, isLoading } = useSWR(`/api/budget/getExpensesByCategory${params}`, fetcher, {
    fallbackData: props.initialData,
  })

  return (
    <>
      {!data && isLoading && (
        <>
          <Text style={{ visibility: 'hidden' }}>
            {new Date(`${props.selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
          </Text>
          <Flex justify="center" align="center" w={300} h={200}>
            <Loader color="blue" type="dots" />
          </Flex>
        </>
      )}
      {error && (
        <>
          <Text style={{ visibility: 'hidden' }}>
            {new Date(`${props.selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
          </Text>
          <Flex justify="center" align="center" w={300} h={200}>
            <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
          </Flex>
        </>
      )}
      {data && (
        <Flex direction="column" align="center">
          <Text>
            {new Date(`${props.selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
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
