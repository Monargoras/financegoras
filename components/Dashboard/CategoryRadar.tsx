import { Flex, Text } from '@mantine/core'
import { RadarChart } from '@mantine/charts'
import { CategoryExpenseData } from '@/utils/types'

interface CategoryRadarProps {
  lang: string
  selectedMonth: number
  selectedYear: number
  data: CategoryExpenseData[]
}

export default function CategoryRadar(props: CategoryRadarProps) {
  return (
    <Flex direction="column" align="center">
      <Text>
        {new Date(`${props.selectedYear}-${props.selectedMonth}-01`).toLocaleString(props.lang, { month: 'long' })}
      </Text>
      <RadarChart
        w={300}
        h={200}
        data={props.data}
        dataKey="category"
        series={[{ name: 'value', color: 'blue.5', opacity: 0.2 }]}
      />
    </Flex>
  )
}
