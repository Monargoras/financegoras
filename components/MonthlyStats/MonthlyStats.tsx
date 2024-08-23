'use client'

import useSWR, { Fetcher } from 'swr'
import { Container, Flex, Loader, Paper, Text, useMantineTheme } from '@mantine/core'
import { AggregatedIncomeExpenseTotals, Dictionary } from '@/utils/types'

interface MonthlyStatsProps {
  dictionary: Dictionary
  selectedMonth: number
}

export function MonthlyStats(props: MonthlyStatsProps) {
  const theme = useMantineTheme()

  const fetcher: Fetcher<AggregatedIncomeExpenseTotals, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  // update selected year if month changes to month is larger than current month -> is in last year
  const selectedYear =
    props.selectedMonth > new Date().getMonth() + 1 ? new Date().getFullYear() - 1 : new Date().getFullYear()
  const { data, error, isLoading } = useSWR(
    `/api/budget/getAggregatedTransactions?year=${selectedYear}&month=${props.selectedMonth}`,
    fetcher
  )

  return (
    <>
      {isLoading && (
        <Flex justify="center" align="center" w={900} h={200}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={900} h={200}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
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
            <Paper shadow="sm" radius="md" withBorder p="md" m="xs">
              <Text>{props.dictionary.budgetPage.monthlySavings}</Text>
              <Text c={theme.colors.blue[5]}>{data.totalSavings}€</Text>
              {
                // calculate percentage of savings from income
                data.totalIncome > 0 ? (
                  <Text c={theme.colors.blue[5]}>{((data.totalSavings / data.totalIncome) * 100).toFixed(2)}%</Text>
                ) : (
                  <Text c={theme.colors.blue[5]}>100%</Text>
                )
              }
            </Paper>
          </Flex>
        </Container>
      )}
    </>
  )
}
