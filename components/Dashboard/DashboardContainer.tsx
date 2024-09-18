'use client'

import { useState } from 'react'
import useSWR, { Fetcher } from 'swr'
import { Container, Divider, Flex, Loader, Text } from '@mantine/core'
import Dashboard from './Dashboard'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import { DashboardData, Dictionary } from '@/utils/types'

interface DashboardContainerProps {
  lang: string
  dict: Dictionary
  demo: boolean
  initialData: DashboardData
}

export default function DashboardContainer(props: DashboardContainerProps) {
  const [includeSavings, setIncludeSavings] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [timeframe, setTimeframe] = useState(props.dict.budgetPage.last12Months)
  const [grouped, setGrouped] = useState(false)

  const fetcher: Fetcher<DashboardData, string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const selMonth = timeframe === props.dict.budgetPage.last12Months ? new Date().getMonth() + 1 : 12
  const year = timeframe === props.dict.budgetPage.last12Months ? new Date().getFullYear() : selectedYear
  const params = `?year=${year}&month=${selMonth}&selectedMonth=${selectedMonth}
    &includeSavings=${includeSavings}&grouped=${grouped}&lang=${props.lang}&demo=${props.demo}`
  const { data, error, isLoading } = useSWR(`/api/budget/dashboard${params}`, fetcher, {
    fallbackData: props.initialData,
  })

  return (
    <Container fluid>
      <Flex gap="md" justify="center" align="center" direction="column" w="100%">
        {!props.demo && (
          <Flex gap="md" justify="center" align="center" direction="column" w="100%">
            <IncomeExpenseForm dictionary={props.dict} initialData={props.initialData.categories} />
            <Divider size="lg" w="100%" />
          </Flex>
        )}
        {!data && isLoading && (
          <Flex justify="center" align="center" w="100dvw" h="100%">
            <Loader color="blue" type="dots" />
          </Flex>
        )}
        {error && (
          <Flex justify="center" align="center" w="100dvw" h="100%">
            <Text>{props.dict.budgetPage.errorLoadingData}</Text>
          </Flex>
        )}
        {data && (
          <Dashboard
            lang={props.lang}
            dictionary={props.dict}
            demo={props.demo}
            data={data}
            grouped={grouped}
            setGrouped={setGrouped}
            includeSavings={includeSavings}
            setIncludeSavings={setIncludeSavings}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        )}
      </Flex>
    </Container>
  )
}
