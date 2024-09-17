'use client'

import { useMatches } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import { Dictionary, MonthlyExpenseEvolution } from '@/utils/types'
import { colorsHex, getMonthNameArray } from '@/utils/helpers'

interface MonthlyExpenseEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  percentage: boolean
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  timeframe: string
  data: MonthlyExpenseEvolution
}

export default function MonthlyExpenseEvolutionGraph(props: MonthlyExpenseEvolutionGraphProps) {
  const { lang } = props

  const chartWidth = useMatches({
    md: 900,
    sm: 400,
  })

  const getSeries = (d: MonthlyExpenseEvolution) => {
    const categorySet = new Set<string>()
    for (const month of d) {
      for (const category of Object.keys(month)) {
        categorySet.add(category)
      }
    }
    categorySet.delete('month')

    const res = Array.from(categorySet).map((category, index) => ({
      name: category,
      color: colorsHex[index],
    }))
    return res
  }

  return (
    <BarChart
      w={chartWidth}
      h={200}
      data={props.data}
      dataKey="month"
      type={props.percentage ? 'percent' : 'stacked'}
      series={getSeries(props.data)}
      valueFormatter={(value) => `${value.toFixed(2)}€`}
      barChartProps={{
        barGap: 1,
        barCategoryGap: 5,
      }}
      tooltipProps={{
        wrapperStyle: { zIndex: 1000 },
      }}
      barProps={{
        onClick: (event) => {
          const { month } = event.payload
          // get month number from name
          const selectedMonth = getMonthNameArray(lang).indexOf(month) + 1
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
