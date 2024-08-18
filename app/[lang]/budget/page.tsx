import { Container, Flex } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import { TransactionTable } from '@/components/TransactionTable/TransactionTable'
import { MonthlyStats } from '@/components/MonthlyStats/MonthlyStats'

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)

  return (
    <Container fluid>
      <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <IncomeExpenseForm dictionary={dict} />
        <Flex gap="md" justify="space-apart" direction="row" wrap="wrap">
          <MonthlyStats dictionary={dict} />
          <Flex gap="md" justify="center" align="center" direction="column">
            <TransactionTable />
          </Flex>
        </Flex>
      </Flex>
    </Container>
  )
}
