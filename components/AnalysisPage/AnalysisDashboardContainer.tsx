'use client'

import { useState } from 'react'
import { Container, Divider, Flex, Loader, Text } from '@mantine/core'
import useSWR, { Fetcher } from 'swr'
import { AnalysisDashboardData, Dictionary } from '@/utils/types'
import AnalysisControls from './AnalysisControls'
import AnalysisDashboard from './AnalysisDashboard'

interface AnalysisDashboardContainerProps {
  locale: string
  dictionary: Dictionary
  initialData: AnalysisDashboardData
  demo: boolean
}

export default function AnalysisDashboardContainer(props: AnalysisDashboardContainerProps) {
  const [nameSearch, setNameSearch] = useState<string[]>([])
  const [categorySearch, setCategorySearch] = useState<string[]>([])
  const [groupSearch, setGroupSearch] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  // set initial range to last 12 months
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setMonth(new Date().getMonth() - 11)),
    new Date(),
  ])
  const [onlyExpenses, setOnlyExpenses] = useState<boolean>(true)

  const fetcher: Fetcher<AnalysisDashboardData, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const params = `?demo=${props.demo}&names=${nameSearch.join(',')}&categories=${categorySearch.join(',')}&groups=${groupSearch.join(',')}\
&types=${typeFilter.join(',')}${dateRange[0] && dateRange[1] ? `&startDate=${dateRange[0].toUTCString()}&endDate=${dateRange[1].toUTCString()}` : ''}\
&onlyExpenses=${onlyExpenses}&lang=${props.locale}`
  const { data, error, isLoading } = useSWR(`/api/analysis/dashboard${params}`, fetcher, {
    fallbackData: props.initialData,
    keepPreviousData: true,
  })

  return (
    <Container fluid>
      <Flex gap="md" justify="center" align="center" direction="column" w="100%">
        {!data && isLoading && (
          <Flex justify="center" align="center" w="100dvw" h="100%">
            <Loader color="blue" type="dots" />
          </Flex>
        )}
        {error && (
          <Flex justify="center" align="center" w="100dvw" h="100%">
            <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
          </Flex>
        )}
        {data && (
          <Flex gap="md" justify="center" align="center" direction="column" w="100%">
            <AnalysisControls
              nameSearch={nameSearch}
              setNameSearch={setNameSearch}
              categorySearch={categorySearch}
              setCategorySearch={setCategorySearch}
              groupSearch={groupSearch}
              setGroupSearch={setGroupSearch}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              listOfNames={data.listOfNames}
              listOfCategories={
                data.categories
                  ? data.categories
                      .map((c) => c.items)
                      .flat()
                      .map((i) => i.name)
                  : []
              }
              listOfGroups={data.categories ? data.categories.map((c) => c.group) : []}
              dictionary={props.dictionary}
              onlyExpenses={onlyExpenses}
              setOnlyExpenses={setOnlyExpenses}
            />
            <Divider size="lg" w="100%" />
            <AnalysisDashboard locale={props.locale} dictionary={props.dictionary} demo={props.demo} data={data} />
          </Flex>
        )}
      </Flex>
    </Container>
  )
}
