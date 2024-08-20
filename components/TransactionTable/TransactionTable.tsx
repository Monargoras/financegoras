'use client'

import useSWR from 'swr'
import { Loader, Table, Text } from '@mantine/core'
import { Transaction } from '@/utils/types'

interface TransactionTableProps {
  lang: string
}

export function TransactionTable(props: TransactionTableProps) {
  const fetcher = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/budget/getTransactions', fetcher)

  console.log(data)

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>Error loading data.</Text>}
      {data && data.transactions && (
        <Table striped highlightOnHover withRowBorders={false} withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Started</Table.Th>
              <Table.Th>Stopped</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.transactions.map((ta: Transaction) => (
              <Table.Tr key={ta.id}>
                <Table.Td c={ta.isIncome ? 'green' : 'red'}>{ta.amount}</Table.Td>
                <Table.Td>{ta.name}</Table.Td>
                <Table.Td>{ta.category}</Table.Td>
                <Table.Td>{ta.transactionType}</Table.Td>
                <Table.Td>{new Date(ta.createdAt).toLocaleDateString(props.lang)}</Table.Td>
                <Table.Td>{ta.stoppedAt ? new Date(ta.stoppedAt).toLocaleDateString(props.lang) : '-'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
}
