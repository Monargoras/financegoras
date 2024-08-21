'use client'

import useSWR, { Fetcher } from 'swr'
import { Container, Flex, Loader, Paper, Text, useMantineTheme } from '@mantine/core'
import { AggregatedIncomeExpenseTotals, Dictionary } from '@/utils/types'

interface MonthlyStatsProps {
  dictionary: Dictionary
}

export function MonthlyStats(props: MonthlyStatsProps) {
  const theme = useMantineTheme()

  const fetcher: Fetcher<AggregatedIncomeExpenseTotals, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const { data, error, isLoading } = useSWR(
    `/api/budget/getAggregatedTransactions?year=${currentYear}&month=${currentMonth}`,
    fetcher
  )

  return (
    <>
      {isLoading && <Loader color="blue" type="dots" />}
      {error && <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>}
      {data && (
        <Container>
          <Flex gap="md" justify="space-apart" direction="row" wrap="wrap">
            <Paper shadow="sm" radius="md" withBorder p="md" m="xs">
              <Text>{props.dictionary.budgetPage.monthlyIncome}</Text>
              <Text c={theme.colors.green[5]}>{data.totalIncome}€</Text>
            </Paper>
            <Paper shadow="sm" radius="md" withBorder p="md" m="xs">
              <Text>{props.dictionary.budgetPage.monthlyExpenses}</Text>
              <Text c={theme.colors.red[5]}>{data.totalExpenses}€</Text>
              {
                // calculate percentage of expenses from income
                data.totalIncome > 0 ? (
                  <Text c={theme.colors.red[5]}>{((data.totalExpenses / data.totalIncome) * 100).toFixed(2)}%</Text>
                ) : (
                  <Text c={theme.colors.red[5]}>100%</Text>
                )
              }
            </Paper>
          </Flex>
        </Container>
      )}
    </>
  )
}
