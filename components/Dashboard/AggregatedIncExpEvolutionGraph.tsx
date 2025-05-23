'use client'

import { useContext } from 'react'
import { Paper, Text, useMantineColorScheme, Flex, useMantineTheme } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import { AggregatedIncomeExpenseEvolution, Dictionary } from '@/utils/types'
import { getMonthNameArray } from '@/utils/helpers'
import { PrivacyModeContext } from '@/components/ClientProviders/ClientProviders'

interface AggregatedIncExpEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  timeframe: string
  percentage: boolean
  data: AggregatedIncomeExpenseEvolution
}

interface ChartTooltipProps {
  label: string
  payload: Record<string, unknown>[] | undefined
  dict: Dictionary
}

function ChartTooltip({ label, payload, dict }: ChartTooltipProps) {
  if (!payload) return null
  // reverse and remove duplicates
  const sortedPayload = [...payload]
    .reverse()
    .filter((item, index, self) => self.findIndex((t) => t.name === item.name) === index)

  const colorScheme = useMantineColorScheme()
  const theme = useMantineTheme()
  const textColor = colorScheme.colorScheme === 'dark' ? 'white' : 'black'
  const { privacyMode } = useContext(PrivacyModeContext)

  const series = {
    totalExpenses: { label: dict.budgetPage.monthlyExpenses, color: theme.colors.expense[5] },
    totalSavings: { label: dict.budgetPage.monthlySavings, color: theme.colors.saving[5] },
    remainingIncome: { label: dict.budgetPage.remainingIncome, color: theme.colors.remaining[5] },
  }

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5} c={textColor}>
        {label}
      </Text>
      <Flex gap={6} direction="column">
        {sortedPayload.map((item) => (
          <Flex key={item.name as string} align="center">
            {series[item.name as 'totalExpenses' | 'totalSavings' | 'remainingIncome'].color && (
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 5,
                  backgroundColor: series[item.name as 'totalExpenses' | 'totalSavings' | 'remainingIncome'].color,
                  marginRight: 10,
                }}
              />
            )}
            <Text fz="sm">{series[item.name as 'totalExpenses' | 'totalSavings' | 'remainingIncome'].label}</Text>
            <Flex ml={36} />
            <Text ml="auto" fz="sm" c={textColor}>
              {privacyMode ? '**.**' : (item.value as number).toFixed(2)}€
            </Text>
          </Flex>
        ))}
      </Flex>
    </Paper>
  )
}

export default function AggregatedIncExpEvolutionGraph(props: AggregatedIncExpEvolutionGraphProps) {
  const { privacyMode } = useContext(PrivacyModeContext)

  return (
    <AreaChart
      w={{
        xl: 1600,
        md: 1200,
        sm: 400,
      }}
      h={{
        xl: 400,
        md: 220,
        sm: 220,
        base: 220,
      }}
      data={props.data.series}
      dataKey="month"
      type={props.percentage ? 'percent' : 'stacked'}
      withGradient
      tooltipAnimationDuration={200}
      tooltipProps={{
        wrapperStyle: { zIndex: 1000 },
        content: ({ label, payload }) => (
          <ChartTooltip label={label} payload={payload as Record<string, number>[]} dict={props.dictionary} />
        ),
      }}
      yAxisProps={{
        domain: ([dataMin, dataMax]) => [
          dataMin,
          // round up to nearest 100
          props.percentage ? props.data.maxPercentageOfIncomeUsed : Math.ceil(dataMax / 100) * 100,
        ],
      }}
      series={[
        // remove total income for readability, replaced by remaining income
        // { name: 'totalIncome', label: props.dictionary.budgetPage.monthlyIncome, color: 'income.5' },
        { name: 'totalExpenses', label: props.dictionary.budgetPage.monthlyExpenses, color: 'expense.5' },
        { name: 'totalSavings', label: props.dictionary.budgetPage.monthlySavings, color: 'saving.5' },
        { name: 'remainingIncome', label: props.dictionary.budgetPage.remainingIncome, color: 'remaining.5' },
      ]}
      valueFormatter={(value) => `${privacyMode ? '**.**' : value.toFixed(2)}€`}
      activeDotProps={{
        onClick: (_event, payload) => {
          // get month number from name
          // @ts-expect-error payload is not typed in correctly by recharts, but does exist
          const selectedMonth = getMonthNameArray(props.lang).indexOf(payload.payload.month) + 1
          props.setSelectedMonth(selectedMonth)
          if (
            props.timeframe === props.dictionary.budgetPage.last12Months &&
            selectedMonth > new Date().getMonth() + 1
          ) {
            props.setSelectedYear(new Date().getFullYear() - 1)
          }
          if (
            props.timeframe === props.dictionary.budgetPage.last12Months &&
            selectedMonth <= new Date().getMonth() + 1
          ) {
            props.setSelectedYear(new Date().getFullYear())
          }
        },
      }}
    />
  )
}
