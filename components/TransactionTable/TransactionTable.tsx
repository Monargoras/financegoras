'use client'

import useSWR from 'swr'
import { Loader, Table, Text, useMantineTheme } from '@mantine/core'
import { Dictionary, Transaction } from '@/utils/types'

interface TransactionTableProps {
  dictionary: Dictionary
}

export function TransactionTable(props: TransactionTableProps) {
  const theme = useMantineTheme()

  const fetcher = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/budget/getTransactions', fetcher)

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>}
      {data && data.transactions && (
        <Table.ScrollContainer mah="95dvh" minWidth={300}>
          <Table striped highlightOnHover withRowBorders={false} withTableBorder stickyHeader stickyHeaderOffset={-1}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{props.dictionary.budgetPage.amount}</Table.Th>
                <Table.Th>{props.dictionary.budgetPage.name}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.transactions.map((ta: Transaction) => (
                <Table.Tr key={ta.id}>
                  <Table.Td c={ta.isIncome ? theme.colors.green[5] : theme.colors.red[5]}>
                    {ta.isIncome ? '' : '-'}
                    {ta.amount.toFixed(2)}€
                  </Table.Td>
                  <Table.Td>{ta.name}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </>
  )
}
