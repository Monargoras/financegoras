'use client'

import useSWR, { Fetcher } from 'swr'
import { Flex, Loader, Table, Text, useMantineTheme } from '@mantine/core'
import { Dictionary, Transaction } from '@/utils/types'

interface TransactionTableProps {
  dictionary: Dictionary
}

export function TransactionTable(props: TransactionTableProps) {
  const theme = useMantineTheme()

  const fetcher: Fetcher<Transaction[], string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/budget/getTransactions', fetcher)

  return (
    <>
      {isLoading && (
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
                <Table.Tr key={ta.id}>
                  <Table.Td
                    c={ta.isIncome ? theme.colors.green[5] : ta.isSavings ? theme.colors.blue[5] : theme.colors.red[5]}
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
      )}
    </>
  )
}
