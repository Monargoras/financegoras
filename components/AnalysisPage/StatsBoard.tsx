'use client'

import { Divider, Flex, Paper, Text, useMantineTheme } from '@mantine/core'
import { Dictionary, StatsBoardData } from '@/utils/types'

interface StatsBoardProps {
  dict: Dictionary
  data: StatsBoardData
}

export default function StatsBoard(props: StatsBoardProps) {
  const theme = useMantineTheme()
  const paperStyles = {
    shadow: 'sm',
    radius: 'md',
    withBorder: true,
    p: 'md',
    pt: 8,
    m: 'xs',
    align: 'center',
  }

  return (
    <Flex gap="md" justify="center" direction="column">
      <Paper {...paperStyles}>
        <Text>{props.dict.analysisPage.total}</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="flex-end" align="center" direction="column">
            <Text>{props.dict.analysisPage.expenses}</Text>
            <Divider w="100%" />
            <Text c={theme.colors.red[5]}>{props.data.totalFiltered.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.totalFiltered.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text>{props.dict.analysisPage.income}</Text>
            <Text>{props.dict.analysisPage.remaining}</Text>
            <Divider w="100%" />
            <Text c={theme.colors.green[5]}>{props.data.totalFiltered.income.toFixed(2)}€</Text>
            <Text c={theme.colors.cyan[5]}>{props.data.totalFiltered.remainingIncome.toFixed(2)}€</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="flex-end" align="center" direction="column">
            <Text>{props.dict.analysisPage.savings}</Text>
            <Divider w="100%" />
            <Text c={theme.colors.blue[5]}>{props.data.totalFiltered.savings.toFixed(2)}€</Text>
            <Text c={theme.colors.blue[5]}>{props.data.totalFiltered.savingsPercentage.toFixed(2)}%</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dict.analysisPage.averageMonth}</Text>
        <Text>{props.dict.analysisPage.averagePercentageMonth}</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.averagePerMonth.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.averagePerMonth.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.averagePerMonth.income.toFixed(2)}€</Text>
            <Text c={theme.colors.cyan[5]}>{props.data.averagePerMonth.remainingIncome.toFixed(2)}€</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.blue[5]}>{props.data.averagePerMonth.savings.toFixed(2)}€</Text>
            <Text c={theme.colors.blue[5]}>{props.data.averagePerMonth.savingsPercentage.toFixed(2)}%</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dict.analysisPage.maxMonth}</Text>
        <Text>{props.dict.analysisPage.maxPercentageMonth}</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.maximumOneMonth.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.maximumOneMonth.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.maximumOneMonth.income.toFixed(2)}€</Text>
            <Text c={theme.colors.cyan[5]}>{props.data.maximumOneMonth.remainingIncome.toFixed(2)}€</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.blue[5]}>{props.data.maximumOneMonth.savings.toFixed(2)}€</Text>
            <Text c={theme.colors.blue[5]}>{props.data.maximumOneMonth.savingsPercentage.toFixed(2)}%</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper {...paperStyles}>
        <Text>{props.dict.analysisPage.minMonth}</Text>
        <Text>{props.dict.analysisPage.minPercentageMonth}</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.minimumOneMonth.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.minimumOneMonth.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.minimumOneMonth.income.toFixed(2)}€</Text>
            <Text c={theme.colors.cyan[5]}>{props.data.minimumOneMonth.remainingIncome.toFixed(2)}€</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.blue[5]}>{props.data.minimumOneMonth.savings.toFixed(2)}€</Text>
            <Text c={theme.colors.blue[5]}>{props.data.minimumOneMonth.savingsPercentage.toFixed(2)}%</Text>
          </Flex>
        </Flex>
      </Paper>
    </Flex>
  )
}
