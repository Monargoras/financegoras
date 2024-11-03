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
        w={{
          xl: 600,
          md: 350,
          base: 350,
        }}
        h={{
          xl: 400,
          md: 280,
          base: 280,
        }}
        data={props.data}
        dataKey="category"
        series={[{ name: 'value', color: 'primary.5', opacity: 0.2 }]}
        polarAngleAxisProps={{
          width: 90,
        }}
      />
    </Flex>
  )
}
