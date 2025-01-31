'use client'

import { useState } from 'react'
import useSWR, { Fetcher } from 'swr'
import { Container, Divider, Flex, Loader, Text } from '@mantine/core'
import Dashboard from './Dashboard'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import { DashboardDTO, Dictionary } from '@/utils/types'
import AddFirstTransactionView from '@/components/Welcome/AddFirstTransactionView'

interface DashboardContainerProps {
  lang: string
  dict: Dictionary
  demo: boolean
  initialData: DashboardDTO
}

export default function DashboardContainer(props: DashboardContainerProps) {
  const [includeSavings, setIncludeSavings] = useState(props.initialData.settings.includeSavings)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [timeframe, setTimeframe] = useState(props.dict.budgetPage.last12Months)
  const [grouped, setGrouped] = useState(props.initialData.settings.grouped)
  const [includeEmptyCategories, setIncludeEmptyCategories] = useState(
    props.initialData.settings.includeEmptyCategories
  )
  const [percentage, setPercentage] = useState(props.initialData.settings.percentage)

  const fetcher: Fetcher<DashboardDTO, string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const selMonth = timeframe === props.dict.budgetPage.last12Months ? new Date().getMonth() + 1 : 12
  const year = timeframe === props.dict.budgetPage.last12Months ? new Date().getFullYear() : selectedYear
  const params = `?year=${year}&month=${selMonth}&selectedMonth=${selectedMonth}&selectedYear=${selectedYear}\
&includeSavings=${includeSavings}&grouped=${grouped}&lang=${props.lang}&demo=${props.demo}&includeEmptyCategories=${includeEmptyCategories}\
&dateUtc=${new Date().toUTCString()}`
  const { data, error, isLoading } = useSWR(`/api/budget/dashboard${params}`, fetcher, {
    fallbackData: props.initialData,
    keepPreviousData: true,
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
            <Loader type="dots" />
          </Flex>
        )}
        {error && (
          <Flex justify="center" align="center" w="100dvw" h="100%">
            <Text>{props.dict.budgetPage.errorLoadingData}</Text>
          </Flex>
        )}
        {data && data.transactions.length > 0 && (
          <Dashboard
            lang={props.lang}
            dictionary={props.dict}
            demo={props.demo}
            data={{
              ...data,
              transactions: data.transactions.map((t) => ({
                ...t,
                createdAt: new Date(t.createdAt),
                stoppedAt: t.stoppedAt ? new Date(t.stoppedAt) : null,
              })),
            }}
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
            includeEmptyCategories={includeEmptyCategories}
            setIncludeEmptyCategories={setIncludeEmptyCategories}
            percentage={percentage}
            setPercentage={setPercentage}
          />
        )}
        {data && data.transactions.length === 0 && (
          <AddFirstTransactionView dict={props.dict} categories={props.initialData.categories} onlyText />
        )}
      </Flex>
    </Container>
  )
}
