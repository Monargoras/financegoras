'use client'

import useSWR from 'swr'
import { Container, Flex, Loader, Paper, Text } from '@mantine/core'
import { Dictionary } from '@/utils/types'

interface MonthlyStatsProps {
  dictionary: Dictionary
}

export function MonthlyStats(props: MonthlyStatsProps) {
  const fetcher = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/budget/getAggregatedTransactions', fetcher)

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>Error loading data.</Text>}
      {data && (
        <Container>
          <Flex gap="md" justify="space-apart" direction="row" wrap="wrap">
            <Paper shadow="sm" radius="md" withBorder p="md" m="xs">
              <Text>{props.dictionary.budgetPage.monthlyIncome}</Text>
              <Text c="green">{data.totalIncome}€</Text>
            </Paper>
            <Paper shadow="sm" radius="md" withBorder p="md" m="xs">
              <Text>{props.dictionary.budgetPage.monthlyExpenses}</Text>
              <Text c="red">{data.totalExpenses}€</Text>
            </Paper>
          </Flex>
        </Container>
      )}
    </>
  )
}
