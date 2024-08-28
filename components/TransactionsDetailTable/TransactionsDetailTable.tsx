'use client'

import { Flex, Loader, Text, Table, useMantineTheme } from '@mantine/core'
import useSWR, { Fetcher } from 'swr'
import { IconDots } from 'tabler-icons'
import { Dictionary, Transaction, TransactionType } from '@/utils/types'

interface TransactionsDetailTableProps {
  locale: string
  dictionary: Dictionary
}

export default function TransactionsDetailTable(props: TransactionsDetailTableProps) {
  const theme = useMantineTheme()

  const fetcher: Fetcher<Transaction[], string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/transactions/getAllTransactions', fetcher)

  return (
    <Flex justify="center">
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>}
      {data && (
        <Table.ScrollContainer mah="77dvh" minWidth={400} w="95dvw" style={{ margin: 8 }}>
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
              {data.map((ta: Transaction) => (
                <Table.Tr key={ta.id}>
                  <Table.Td
                    c={ta.isIncome ? theme.colors.green[5] : ta.isSavings ? theme.colors.blue[5] : theme.colors.red[5]}
                  >
                    {ta.isIncome ? '' : '-'}
                    {ta.amount.toFixed(2)}€
                  </Table.Td>
                  <Table.Td>{ta.name}</Table.Td>
                  <Table.Td>{ta.category}</Table.Td>
                  <Table.Td>{props.dictionary.budgetPage[TransactionType[ta.transactionType].toLowerCase()]}</Table.Td>
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
      )}
    </Flex>
  )
}
