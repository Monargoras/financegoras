import { Container, Flex, Text } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import { TransactionTable } from '@/components/TransactionTable/TransactionTable'

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)

  return (
    <Container fluid>
      <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <Text>{dict.budgetPage.budgetBook}</Text>
        <IncomeExpenseForm language={lang} dictionary={dict} />
        <TransactionTable />
      </Flex>
    </Container>
  )
}
