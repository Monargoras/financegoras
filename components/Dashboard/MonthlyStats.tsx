'use client'

import useSWR, { Fetcher } from 'swr'
import { Flex, Loader, Paper, Text, useMantineTheme } from '@mantine/core'
import { AggregatedIncomeExpenseTotals, Dictionary } from '@/utils/types'

interface MonthlyStatsProps {
  dictionary: Dictionary
  selectedMonth: number
  selectedYear: number
  demo: boolean
  initialData: AggregatedIncomeExpenseTotals
}

export function MonthlyStats(props: MonthlyStatsProps) {
  const theme = useMantineTheme()

  const fetcher: Fetcher<AggregatedIncomeExpenseTotals, string> = (input: RequestInfo | URL) =>
    fetch(input).then((res) => res.json())
  const { data, error, isLoading } = useSWR(
    `/api/budget/getAggregatedTransactions?year=${props.selectedYear}&month=${props.selectedMonth}&demo=${props.demo}`,
    fetcher,
    {
      fallbackData: props.initialData,
    }
  )

  const paperStyles = {
    shadow: 'sm',
    radius: 'md',
    withBorder: true,
    p: 'md',
    m: 'xs',
    maw: '35dvw',
  }

  return (
    <>
      {!data && isLoading && (
        <Flex justify="center" align="center" w={500} h={200}>
          <Loader color="blue" type="dots" />
        </Flex>
      )}
      {error && (
        <Flex justify="center" align="center" w={500} h={200}>
          <Text>{props.dictionary.budgetPage.errorLoadingData}</Text>
        </Flex>
      )}
      {data && (
        <Flex gap="md" justify="center" direction="row" wrap="wrap">
          <Paper {...paperStyles}>
            <Text>{props.dictionary.budgetPage.monthlyIncome}</Text>
            <Text c={theme.colors.green[5]}>{data.totalIncome}€</Text>
          </Paper>
          <Paper {...paperStyles}>
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
          <Paper {...paperStyles}>
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
          <Paper {...paperStyles}>
            <Text>{props.dictionary.budgetPage.remainingIncome}</Text>
            <Text c={theme.colors.cyan[5]}>
              {(data.totalIncome - data.totalExpenses - data.totalSavings).toFixed(2)}€
            </Text>
            {
              // calculate leftover percentage of income
              data.totalIncome > 0 ? (
                <Text c={theme.colors.cyan[5]}>
                  {(((data.totalIncome - data.totalExpenses - data.totalSavings) / data.totalIncome) * 100).toFixed(2)}%
                </Text>
              ) : (
                <Text c={theme.colors.green[5]}>0%</Text>
              )
            }
          </Paper>
        </Flex>
      )}
    </>
  )
}
