'use client'

import { Loader, Text } from '@mantine/core'
import { RadarChart } from '@mantine/charts'
import useSWR, { Fetcher } from 'swr'
import { CategoryExpenseData, Dictionary } from '@/utils/types'

interface CategoryRadarProps {
  dictionary: Dictionary
  percentage: boolean
  includeSavings: boolean
}

export default function CategoryRadar(props: CategoryRadarProps) {
  const fetcher: Fetcher<CategoryExpenseData[], string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const params = `?year=${currentYear}&month=${currentMonth}&percentage=${props.percentage}&includeSavings=${props.includeSavings}`
  const { data, error, isLoading } = useSWR(`/api/budget/getExpensesByCategory${params}`, fetcher)

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>}
      {data && (
        <RadarChart
          h={200}
          w={300}
          data={data}
          dataKey="category"
          series={[{ name: 'value', color: 'blue.5', opacity: 0.2 }]}
        />
      )}
    </>
  )
}
