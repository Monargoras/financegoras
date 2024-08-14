import { Container, Flex, Text } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/IncomeExpenseForm/IncomeExpenseForm'

export default async function BudgetPage({ params: { lang } }: PageProps) {
  // get currently used dictionary
  const dict = await getDictionary(lang)

  return (
    <Container>
      <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <Text>{dict.budgetPage.budgetBook}</Text>
        <IncomeExpenseForm dictionary={dict} />
      </Flex>
    </Container>
  )
}
