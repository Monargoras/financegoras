import { Text, Paper, Flex, useMantineColorScheme } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import { CategoryEvolutionLineChartData, ColorMap } from '@/utils/types'

interface CategoryEvolutionLineChartProps {
  data: CategoryEvolutionLineChartData
  colorMap: ColorMap
}

interface ChartTooltipProps {
  label: string
  payload: Record<string, unknown>[] | undefined
}

function ChartTooltip({ label, payload }: ChartTooltipProps) {
  if (!payload) return null
  const sortedPayload = [...payload]
    .sort((a, b) => (b.value as number) - (a.value as number))
    .filter((item) => (item.value as number) > 0)

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

export default function CategoryEvolutionLineChart(props: CategoryEvolutionLineChartProps) {
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
      type="default"
      legendProps={{ verticalAlign: 'bottom' }}
      tooltipAnimationDuration={200}
      tooltipProps={{
        wrapperStyle: { zIndex: 1000 },
        content: ({ label, payload }) => <ChartTooltip label={label} payload={payload as Record<string, number>[]} />,
      }}
      series={getSeries(props.data)}
      valueFormatter={(value) => `${value.toFixed(2)}€`}
    />
  )
}
