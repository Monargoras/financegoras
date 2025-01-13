'use client'

import { useContext } from 'react'
import { Box, Flex, Paper, Text, Tooltip, useMantineTheme } from '@mantine/core'
import { AggregatedIncomeExpenseTotals, Dictionary } from '@/utils/types'
import { PrivacyModeContext } from '@/components/ClientProviders/ClientProviders'
import MobileTooltipPopover from './MobileTooltipPopover'

interface MonthlyStatsProps {
  dictionary: Dictionary
  data: AggregatedIncomeExpenseTotals
}

export function MonthlyStats(props: MonthlyStatsProps) {
  const theme = useMantineTheme()
  const { privacyMode } = useContext(PrivacyModeContext)

  const paperStyles = {
    shadow: 'sm',
    radius: 'md',
    withBorder: true,
    p: 'md',
    m: 'xs',
    maw: '35dvw',
  }

  return (
    <Flex
      gap={0}
      justify="center"
      direction="row"
      wrap="wrap"
      w={{
        xl: 1600,
        md: 1200,
        sm: 400,
      }}
    >
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.monthlyIncome}</Text>
        <Text c={theme.colors.income[5]}>{privacyMode ? '**.**' : props.data.totalIncome.toFixed(2)}€</Text>
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.monthlyExpenses}</Text>
        <Text c={theme.colors.expense[5]}>{privacyMode ? '**.**' : props.data.totalExpenses.toFixed(2)}€</Text>
        {
          // calculate percentage of expenses from income
          props.data.totalIncome > 0 ? (
            <Text c={theme.colors.expense[5]}>
              {((props.data.totalExpenses / props.data.totalIncome) * 100).toFixed(2)}%
            </Text>
          ) : (
            <Text c={theme.colors.expense[5]}>100%</Text>
          )
        }
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.monthlySavings}</Text>
        <Text c={theme.colors.saving[5]}>{privacyMode ? '**.**' : props.data.totalSavings.toFixed(2)}€</Text>
        {
          // calculate percentage of savings from income
          props.data.totalIncome > 0 ? (
            <Text c={theme.colors.saving[5]}>
              {((props.data.totalSavings / props.data.totalIncome) * 100).toFixed(2)}%
            </Text>
          ) : (
            <Text c={theme.colors.saving[5]}>100%</Text>
          )
        }
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dictionary.budgetPage.remainingIncome}</Text>
        <Text c={theme.colors.remaining[5]}>
          {privacyMode
            ? '**.**'
            : (props.data.totalIncome - props.data.totalExpenses - props.data.totalSavings).toFixed(2)}
          €
        </Text>
        {
          // calculate leftover percentage of income
          props.data.totalIncome > 0 ? (
            <Text c={theme.colors.remaining[5]}>
              {(
                ((props.data.totalIncome - props.data.totalExpenses - props.data.totalSavings) /
                  props.data.totalIncome) *
                100
              ).toFixed(2)}
              %
            </Text>
          ) : (
            <Text c={theme.colors.remaining[5]}>0%</Text>
          )
        }
      </Paper>
      <Paper {...paperStyles} maw="100%">
        <Flex direction="row" gap="md">
          <Text>{props.dictionary.budgetPage.averageToDateShort}</Text>
          <Tooltip label={props.dictionary.budgetPage.averageToDate} position="top" maw={300} multiline>
            <Box mb={-6} mt={-3}>
              <MobileTooltipPopover label={props.dictionary.budgetPage.averageToDate} />
            </Box>
          </Tooltip>
        </Flex>
        <Text c={theme.colors.gray[5]}>{privacyMode ? '**.**' : props.data.averageExpensesToDate.toFixed(2)}€</Text>
        <Text c={theme.colors.gray[5]}>{props.data.averagePercentageOfIncomeToDate.toFixed(2)}%</Text>
      </Paper>
    </Flex>
  )
}
