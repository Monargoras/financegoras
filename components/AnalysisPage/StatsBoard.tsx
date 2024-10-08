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
    m: 'xs',
    align: 'center',
  }

  return (
    <Flex gap="md" justify="center" direction="column">
      <Paper {...paperStyles}>
        <Text>Total filtered</Text>
        <Flex gap="md" justify="space-around" direction="row">
          <Text>Expenses</Text>
          <Text>Income</Text>
          <Text>Savings</Text>
        </Flex>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.totalFiltered.expenses.toFixed(2)}€</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.totalFiltered.income.toFixed(2)}€</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.blue[5]}>{props.data.totalFiltered.savings.toFixed(2)}€</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper {...paperStyles}>
        <Text>Average Per Month</Text>
        <Text>Average Percentage of expenses</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.averagePerMonth.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.averagePerMonth.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.averagePerMonth.income.toFixed(2)}€</Text>
            <Text c={theme.colors.green[5]}>{props.data.averagePerMonth.incomePercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.blue[5]}>{props.data.averagePerMonth.savings.toFixed(2)}€</Text>
            <Text c={theme.colors.blue[5]}>{props.data.averagePerMonth.savingsPercentage.toFixed(2)}%</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper {...paperStyles}>
        <Text>Maximum One Month</Text>
        <Text>Maximum Percentage of expenses that month</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.maximumOneMonth.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.maximumOneMonth.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.maximumOneMonth.income.toFixed(2)}€</Text>
            <Text c={theme.colors.green[5]}>{props.data.maximumOneMonth.incomePercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.blue[5]}>{props.data.maximumOneMonth.savings.toFixed(2)}€</Text>
            <Text c={theme.colors.blue[5]}>{props.data.maximumOneMonth.savingsPercentage.toFixed(2)}%</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper {...paperStyles}>
        <Text>Minimum One Month</Text>
        <Text>Minimum Percentage of expenses that month</Text>
        <Divider />
        <Flex gap="md" justify="space-evenly" direction="row">
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.red[5]}>{props.data.minimumOneMonth.expenses.toFixed(2)}€</Text>
            <Text c={theme.colors.red[5]}>{props.data.minimumOneMonth.expensesPercentage.toFixed(2)}%</Text>
          </Flex>
          <Divider orientation="vertical" />
          <Flex justify="center" align="center" direction="column">
            <Text c={theme.colors.green[5]}>{props.data.minimumOneMonth.income.toFixed(2)}€</Text>
            <Text c={theme.colors.green[5]}>{props.data.minimumOneMonth.incomePercentage.toFixed(2)}%</Text>
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
