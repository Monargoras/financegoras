'use client'

import { Flex, Paper, Text, useMantineTheme } from '@mantine/core'
import { AggregatedIncomeExpenseTotals, Dictionary } from '@/utils/types'

interface MonthlyStatsProps {
  dictionary: Dictionary
  data: AggregatedIncomeExpenseTotals
}

export function MonthlyStats(props: MonthlyStatsProps) {
  const theme = useMantineTheme()

  const paperStyles = {
    shadow: 'sm',
    radius: 'md',
    withBorder: true,
    p: 'md',
    m: 'xs',
    maw: '35dvw',
  }

  return (
    <Flex gap="md" justify="center" direction="row" wrap="wrap">
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.monthlyIncome}</Text>
        <Text c={theme.colors.green[5]}>{props.data.totalIncome.toFixed(2)}€</Text>
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.monthlyExpenses}</Text>
        <Text c={theme.colors.red[5]}>{props.data.totalExpenses.toFixed(2)}€</Text>
        {
          // calculate percentage of expenses from income
          props.data.totalIncome > 0 ? (
            <Text c={theme.colors.red[5]}>
              {((props.data.totalExpenses / props.data.totalIncome) * 100).toFixed(2)}%
            </Text>
          ) : (
            <Text c={theme.colors.red[5]}>100%</Text>
          )
        }
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.monthlySavings}</Text>
        <Text c={theme.colors.blue[5]}>{props.data.totalSavings.toFixed(2)}€</Text>
        {
          // calculate percentage of savings from income
          props.data.totalIncome > 0 ? (
            <Text c={theme.colors.blue[5]}>
              {((props.data.totalSavings / props.data.totalIncome) * 100).toFixed(2)}%
            </Text>
          ) : (
            <Text c={theme.colors.blue[5]}>100%</Text>
          )
        }
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.remainingIncome}</Text>
        <Text c={theme.colors.cyan[5]}>
          {(props.data.totalIncome - props.data.totalExpenses - props.data.totalSavings).toFixed(2)}€
        </Text>
        {
          // calculate leftover percentage of income
          props.data.totalIncome > 0 ? (
            <Text c={theme.colors.cyan[5]}>
              {(
                ((props.data.totalIncome - props.data.totalExpenses - props.data.totalSavings) /
                  props.data.totalIncome) *
                100
              ).toFixed(2)}
              %
            </Text>
          ) : (
            <Text c={theme.colors.green[5]}>0%</Text>
          )
        }
      </Paper>
    </Flex>
  )
}
