'use client'

import { useEffect, useState } from 'react'
import { Container, Divider, Flex, Loader, Text } from '@mantine/core'
import useSWR, { Fetcher } from 'swr'
import {
  AnalysisDashboardData,
  Categories,
  Dictionary,
  getGroupFromCategory,
  getTransactionType,
  Transaction,
  TransactionType,
} from '@/utils/types'
import AnalysisControls from './AnalysisControls'
import AnalysisDashboard from './AnalysisDashboard'

interface AnalysisDashboardContainerProps {
  locale: string
  dictionary: Dictionary
  initialData: AnalysisDashboardData
  demo: boolean
}

export default function AnalysisDashboardContainer(props: AnalysisDashboardContainerProps) {
  const categoryFetcher: Fetcher<Categories, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const categoryRes = useSWR('/api/budget/getCategories', categoryFetcher, {
    fallbackData: props.initialData.categories ?? [],
    keepPreviousData: true,
  })

  const fetcher: Fetcher<Transaction[], string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/transactions/getAllTransactions', fetcher, {
    fallbackData: props.initialData.transactions,
    keepPreviousData: true,
  })

  // filter/sorting
  const [hideStopped, setHideStopped] = useState(false)
  const [nameSearch, setNameSearch] = useState<string[]>([])
  const [categorySearch, setCategorySearch] = useState<string[]>([])
  const [groupSearch, setGroupSearch] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const [listOfNames, setListOfNames] = useState<string[]>([])
  const [listOfCategories, setListOfCategories] = useState<string[]>([])
  const [listOfGroups, setListOfGroups] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<Transaction[] | undefined>(undefined)

  const filterData = (rawData: Transaction[]) => {
    let res = rawData
    if (hideStopped) {
      res = res.filter((ta) => ta.stoppedAt === null)
    }
    if (nameSearch.length > 0) {
      res = res.filter((ta) => nameSearch.includes(ta.name))
    }
    if (categorySearch.length > 0) {
      res = res.filter((ta) => categorySearch.includes(ta.category))
    }
    if (groupSearch.length > 0) {
      res = res.filter((ta) => groupSearch.includes(getGroupFromCategory(ta.category, categoryRes.data)))
    }
    if (typeFilter.length > 0) {
      res = res.filter((ta) =>
        typeFilter.map((el) => TransactionType[getTransactionType(el)]).includes(TransactionType[ta.transactionType])
      )
    }
    if (dateRange.every((el) => el !== null)) {
      res = res.filter((ta) => {
        const createdAt = new Date(ta.createdAt)
        const stoppedAt = ta.stoppedAt ? new Date(ta.stoppedAt) : null
        // add 24 hours to the end date to include the whole day
        const rangeEnd = new Date(dateRange[1]!.getTime() + 86400000)
        return createdAt < rangeEnd && (!stoppedAt || stoppedAt >= dateRange[0]!)
      })
    }
    return res
  }

  useEffect(() => {
    if (data) {
      const names = Array.from(new Set(data.map((ta: Transaction) => ta.name)))
      const categories = Array.from(new Set(categoryRes.data.map((cat) => cat.items).flat()))
      const groups = Array.from(new Set(categoryRes.data.map((cat) => cat.group)))
      setListOfNames(names)
      setListOfCategories(categories)
      setListOfGroups(groups)
      setFilteredData(filterData(data))
    }
  }, [data, hideStopped, typeFilter, dateRange, nameSearch, categorySearch, groupSearch])

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
              listOfNames={listOfNames}
              listOfCategories={listOfCategories}
              listOfGroups={listOfGroups}
              hideStopped={hideStopped}
              setHideStopped={setHideStopped}
              dictionary={props.dictionary}
            />
            <Divider size="lg" w="100%" />
            <AnalysisDashboard
              locale={props.locale}
              dictionary={props.dictionary}
              demo={props.demo}
              data={{ transactions: filteredData ?? [], categories: categoryRes.data }}
            />
          </Flex>
        )}
      </Flex>
    </Container>
  )
}
