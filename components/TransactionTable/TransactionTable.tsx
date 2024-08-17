'use client'

import useSWR from 'swr'
import { Loader, Text } from '@mantine/core'
import { Transaction } from '@/utils/types'

export function TransactionTable() {
  const fetcher = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/budget/getTransactions', fetcher)

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>Error loading data.</Text>}
      {data &&
        data.transactions &&
        data.transactions.map((transaction: Transaction) => (
          <div
            key={transaction.id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '5px',
              border: '1px solid #ccc',
              width: '300px',
            }}
          >
            <Text>{transaction.name}</Text>
            <Text>{transaction.amount}</Text>
            <Text>{transaction.category}</Text>
          </div>
        ))}
    </>
  )
}
