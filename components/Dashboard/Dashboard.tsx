import { Flex } from '@mantine/core'
import CategoryRadar from './CategoryRadar'
import { Dictionary } from '@/utils/types'

interface DashboardProps {
  dictionary: Dictionary
}

export default function Dashboard(props: DashboardProps) {
  return (
    <Flex>
      <CategoryRadar dictionary={props.dictionary} />
    </Flex>
  )
}
