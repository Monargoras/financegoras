import { Flex } from '@mantine/core'
import { Dictionary } from '@/utils/types'
import CategoryRadar from './CategoryRadar'
import MonthlyExpenseEvolutionGraph from './MonthlyExpenseEvolutionGraph'

interface DashboardProps {
  lang: string
  dictionary: Dictionary
}

export default function Dashboard(props: DashboardProps) {
  return (
    <Flex>
      <MonthlyExpenseEvolutionGraph lang={props.lang} dictionary={props.dictionary} />
      <CategoryRadar dictionary={props.dictionary} />
    </Flex>
  )
}
