'use client'

import { useMatches } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import { CategoryEvolutionLineChartData, ColorMap } from '@/utils/types'

interface CategoryEvolutionLineChartProps {
  data: CategoryEvolutionLineChartData
  colorMap: ColorMap
}

export default function CategoryEvolutionLineChart(props: CategoryEvolutionLineChartProps) {
  const chartWidth = useMatches({
    md: 900,
    sm: 400,
  })

  const getSeries = (d: CategoryEvolutionLineChartData) => {
    const categorySet = new Set<string>()
    for (const month of d) {
      for (const category of Object.keys(month)) {
        categorySet.add(category)
      }
    }
    categorySet.delete('month')

    const res = Array.from(categorySet).map((category) => ({
      name: category,
      color: props.colorMap[category],
    }))
    return res
  }

  return (
    <LineChart
      w={chartWidth}
      h={280}
      data={props.data}
      dataKey="month"
      type="default"
      legendProps={{ verticalAlign: 'bottom' }}
      tooltipProps={{
        wrapperStyle: { zIndex: 1000 },
      }}
      series={getSeries(props.data)}
      valueFormatter={(value) => `${value.toFixed(2)}€`}
    />
  )
}
