import { Container, Divider, Flex } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import IncomeExpenseForm from '@/components/TransactionForm/TransactionForm'
import Dashboard from '@/components/Dashboard/Dashboard'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)

  return (
    <PageTransitionProvider>
      <Container fluid>
        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
          <IncomeExpenseForm dictionary={dict} />
          <Divider size="lg" w="100%" />
          <Dashboard lang={lang} dictionary={dict} />
        </Flex>
      </Container>
    </PageTransitionProvider>
  )
}
