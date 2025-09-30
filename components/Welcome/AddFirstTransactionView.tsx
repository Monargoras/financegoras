import { Divider, Flex, Text } from '@mantine/core'
import TransactionForm from '@/components/TransactionForm/TransactionForm'
import { Categories, Dictionary } from '@/utils/types'

interface AddFirstTransactionViewProps {
  dict: Dictionary
  categories: Categories | null
  onlyText?: boolean
}

export default function AddFirstTransactionView(props: AddFirstTransactionViewProps) {
  return (
    <Flex gap="md" justify="center" align="center" direction="column" h="100%" w="100%">
      {!props.onlyText && (
        <Flex gap="md" justify="center" align="center" direction="column" w="100%">
          <TransactionForm dictionary={props.dict} initialData={props.categories} nameAutocompleteList={[]} />
          <Divider size="lg" w="100%" />
        </Flex>
      )}
      <Text ta="center">{props.dict.general.addFirstTransaction}</Text>
    </Flex>
  )
}
