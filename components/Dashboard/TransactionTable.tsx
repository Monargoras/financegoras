'use client'

import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import useSWR, { Fetcher } from 'swr'
import { Flex, Loader, Table, Text, useMantineTheme } from '@mantine/core'
import { Categories, Dictionary, Transaction } from '@/utils/types'
import TransactionEditModal from '../TransactionsDetailTable/TransactionEditModal'

interface TransactionTableProps {
  dictionary: Dictionary
  selectedMonth: number
  selectedYear: number
  demo: boolean
  initialData: Transaction[]
}

export function TransactionTable(props: TransactionTableProps) {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

  const categoryFetcher: Fetcher<Categories, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const categories = useSWR('/api/budget/getCategories', categoryFetcher, { fallbackData: [] })

  const fetcher: Fetcher<Transaction[], string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR(
    `/api/budget/getTransactions?year=${props.selectedYear}&month=${props.selectedMonth}&demo=${props.demo}`,
    fetcher,
    {
      fallbackData: props.initialData,
    }
  )

  return (
    <>
      {!data && isLoading && (
        <Flex justify="center" align="center" w={250} h={400}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={250} h={400}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
      {data && (
        <>
          <Table.ScrollContainer mah="45dvh" minWidth={250} style={{ margin: 8 }}>
            <Table striped highlightOnHover stickyHeader withTableBorder stickyHeaderOffset={-1}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{props.dictionary.budgetPage.amount}</Table.Th>
                  <Table.Th>{props.dictionary.budgetPage.name}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((ta: Transaction) => (
                  <Table.Tr
                    key={ta.id}
                    onClick={() => {
                      if (!props.demo) {
                        setEditTransaction(ta)
                        open()
                      }
                    }}
                    style={{ cursor: props.demo ? 'default' : 'pointer' }}
                  >
                    <Table.Td
                      c={
                        ta.isIncome ? theme.colors.green[5] : ta.isSavings ? theme.colors.blue[5] : theme.colors.red[5]
                      }
                    >
                      {ta.isIncome ? '' : '-'}
                      {ta.amount.toFixed(2)}€
                    </Table.Td>
                    <Table.Td>{ta.name}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          {!props.demo && editTransaction && (
            <TransactionEditModal
              dictionary={props.dictionary}
              opened={opened}
              close={() => {
                setEditTransaction(null)
                close()
              }}
              transaction={editTransaction}
              categories={categories.data ?? []}
            />
          )}
        </>
      )}
    </>
  )
}
