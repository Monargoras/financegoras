'use client'

import { useEffect, useState } from 'react'
import { Flex, Loader, Text, Table, useMantineTheme } from '@mantine/core'
import useSWR, { Fetcher } from 'swr'
import { useDisclosure } from '@mantine/hooks'
import { IconDots } from '@tabler/icons-react'
import { Categories, Dictionary, getTransactionType, Transaction, TransactionType } from '@/utils/types'
import TableControls from './TableControls'
import TransactionEditModal from './TransactionEditModal'
import generalClasses from '@/utils/general.module.css'

export type InitialDetailTableData = { categories: Categories | null; transactions: Transaction[] }

interface TransactionsDetailTableProps {
  locale: string
  dictionary: Dictionary
  initialData: InitialDetailTableData
}

export default function TransactionsDetailTable(props: TransactionsDetailTableProps) {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

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
  const [earliestFirst, setEarliestFirst] = useState(true)
  const [hideStopped, setHideStopped] = useState(false)
  const [catNameSearch, setCatNameSearch] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const [listOfCategoriesAndNames, setListOfCategoriesAndNames] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<Transaction[] | undefined>(undefined)

  const filterData = (rawData: Transaction[]) => {
    let res = rawData
    if (hideStopped) {
      res = res.filter((ta) => ta.stoppedAt === null)
    }
    if (catNameSearch.length > 0) {
      res = res.filter((ta) => catNameSearch.includes(ta.name) || catNameSearch.includes(ta.category))
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
    if (earliestFirst) {
      res = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      res = res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
    return res
  }

  useEffect(() => {
    if (data) {
      const array = data.map((ta: Transaction) => [ta.category, ta.name]).flat()
      const unique = Array.from(new Set(array))
      setListOfCategoriesAndNames(unique)
      setFilteredData(filterData(data))
    }
  }, [data, hideStopped, typeFilter, dateRange, earliestFirst, catNameSearch])

  return (
    <Flex justify="center">
      {!data && isLoading && <Loader type="dots" />}
      {error && <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>}
      {filteredData && (
        <Flex justify="center" align="center" direction="column">
          <TableControls
            dictionary={props.dictionary}
            listOfCategoriesAndNames={listOfCategoriesAndNames}
            earliestFirst={earliestFirst}
            setEarliestFirst={setEarliestFirst}
            hideStopped={hideStopped}
            setHideStopped={setHideStopped}
            catNameSearch={catNameSearch}
            setCatNameSearch={setCatNameSearch}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <Table.ScrollContainer
            mah="73dvh"
            minWidth={400}
            w="95dvw"
            style={{ margin: 8 }}
            className={generalClasses.styledScroll}
          >
            <Table striped highlightOnHover stickyHeader withTableBorder stickyHeaderOffset={-1}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{props.dictionary.budgetPage.amount}</Table.Th>
                  <Table.Th>{props.dictionary.budgetPage.name}</Table.Th>
                  <Table.Th>{props.dictionary.budgetPage.category}</Table.Th>
                  <Table.Th>{props.dictionary.budgetPage.type}</Table.Th>
                  <Table.Th>{props.dictionary.budgetPage.createdAt}</Table.Th>
                  <Table.Th>{props.dictionary.budgetPage.stoppedAt}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredData.map((ta: Transaction) => (
                  <Table.Tr
                    key={ta.id}
                    onClick={() => {
                      setEditTransaction(ta)
                      open()
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Td
                      c={
                        ta.isIncome
                          ? theme.colors.income[5]
                          : ta.isSavings
                            ? theme.colors.saving[5]
                            : theme.colors.expense[5]
                      }
                    >
                      {ta.isIncome ? '' : '-'}
                      {ta.amount.toFixed(2)}€
                    </Table.Td>
                    <Table.Td>{ta.name}</Table.Td>
                    <Table.Td>{ta.category}</Table.Td>
                    <Table.Td>
                      {props.dictionary.budgetPage[TransactionType[ta.transactionType].toLowerCase()]}
                    </Table.Td>
                    <Table.Td>
                      {new Date(ta.createdAt).toLocaleDateString(props.locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Table.Td>
                    <Table.Td>
                      {ta.transactionType === TransactionType.Single ? (
                        '-'
                      ) : ta.stoppedAt ? (
                        new Date(ta.stoppedAt).toLocaleDateString(props.locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      ) : (
                        <IconDots color="green" />
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          {editTransaction && (
            <TransactionEditModal
              dictionary={props.dictionary}
              opened={opened}
              close={() => {
                setEditTransaction(null)
                close()
              }}
              transaction={editTransaction}
              categories={categoryRes.data ?? []}
            />
          )}
        </Flex>
      )}
    </Flex>
  )
}
