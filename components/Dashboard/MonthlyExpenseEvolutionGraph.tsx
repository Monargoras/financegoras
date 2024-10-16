import { Flex, Paper, useMantineColorScheme, Text } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import { ColorMap, Dictionary, MonthlyExpenseEvolution } from '@/utils/types'
import { getMonthNameArray } from '@/utils/helpers'

interface MonthlyExpenseEvolutionGraphProps {
  lang: string
  dictionary: Dictionary
  percentage: boolean
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  timeframe: string
  data: MonthlyExpenseEvolution
  colorMap: ColorMap
}

interface ChartTooltipProps {
  label: string
  payload: Record<string, unknown>[] | undefined
}

function ChartTooltip({ label, payload }: ChartTooltipProps) {
  if (!payload) return null
  const sortedPayload = [...payload].reverse()

  const theme = useMantineColorScheme()
  const textColor = theme.colorScheme === 'dark' ? 'white' : 'black'

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5} c={textColor}>
        {label}
      </Text>
      <Flex gap={6} direction="column">
        {sortedPayload.map((item) => (
          <Flex key={item.name as string} align="center">
            {(item.color as string) && (
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 5,
                  backgroundColor: item.color as string,
                  marginRight: 10,
                }}
              />
            )}
            <Text fz="sm">{item.name as string}</Text>
            <Flex ml={36} />
            <Text ml="auto" fz="sm" c={textColor}>
              {(item.value as number).toFixed(2)}€
            </Text>
          </Flex>
        ))}
      </Flex>
    </Paper>
  )
}

export default function MonthlyExpenseEvolutionGraph(props: MonthlyExpenseEvolutionGraphProps) {
  const { lang } = props

  const getSeries = (d: MonthlyExpenseEvolution) => {
    const categorySet = new Set<string>()
    for (const month of d) {
      for (const category of Object.keys(month)) {
        categorySet.add(category)
      }
    }
    categorySet.delete('month')

    const res = Array.from(categorySet).map((category) => ({
      name: category,
      color: props.colorMap[category] || '#fff',
    }))
    return res
  }

  return (
    <BarChart
      w={{
        xl: 1300,
        md: 900,
        sm: 400,
      }}
      h={{
        xl: 400,
        md: 300,
      }}
      data={props.data}
      dataKey="month"
      type={props.percentage ? 'percent' : 'stacked'}
      series={getSeries(props.data)}
      valueFormatter={(value) => `${value.toFixed(2)}€`}
      barChartProps={{
        barGap: 1,
        barCategoryGap: 5,
      }}
      tooltipAnimationDuration={200}
      tooltipProps={{
        wrapperStyle: { zIndex: 1000 },
        content: ({ label, payload }) => <ChartTooltip label={label} payload={payload as Record<string, number>[]} />,
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
