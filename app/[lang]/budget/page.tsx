import { Container, Flex, Text } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/IncomeExpenseForm/IncomeExpenseForm'

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)

  return (
    <Container fluid>
      <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <Text>{dict.budgetPage.budgetBook}</Text>
        <IncomeExpenseForm language={lang} dictionary={dict} />
      </Flex>
    </Container>
  )
}
