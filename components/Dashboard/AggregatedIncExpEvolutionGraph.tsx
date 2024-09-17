'use client'

import { useMatches } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import { AggregatedIncomeExpenseEvolution, Dictionary } from '@/utils/types'
import { getMonthNameArray } from '@/utils/helpers'

interface AggregatedIncExpEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  timeframe: string
  percentage: boolean
  data: AggregatedIncomeExpenseEvolution
}

export default function AggregatedIncExpEvolutionGraph(props: AggregatedIncExpEvolutionGraphProps) {
  const chartWidth = useMatches({
    md: 900,
    sm: 400,
  })

  return (
    <AreaChart
      w={chartWidth}
      h={280}
      data={props.data}
      dataKey="month"
      type={props.percentage ? 'percent' : 'stacked'}
      legendProps={{ verticalAlign: 'bottom' }}
      tooltipProps={{
        wrapperStyle: { zIndex: 1000 },
      }}
      yAxisProps={{
        domain: ([dataMin, dataMax]) => [
          dataMin,
          // round up to nearest 100
          props.percentage ? dataMax : Math.ceil(dataMax / 100) * 100,
        ],
      }}
      series={[
        // remove total income for readability, replaced by remaining income
        // { name: 'totalIncome', label: props.dictionary.budgetPage.monthlyIncome, color: 'green.5' },
        { name: 'totalExpenses', label: props.dictionary.budgetPage.monthlyExpenses, color: 'red.5' },
        { name: 'totalSavings', label: props.dictionary.budgetPage.monthlySavings, color: 'blue.5' },
        { name: 'remainingIncome', label: props.dictionary.budgetPage.remainingIncome, color: 'cyan.5' },
      ]}
      valueFormatter={(value) => `${value.toFixed(2)}€`}
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
            selectedMonth < new Date().getMonth() + 1
          ) {
            props.setSelectedYear(new Date().getFullYear())
          }
        },
      }}
    />
  )
}
