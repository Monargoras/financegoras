import { Container, Flex } from '@mantine/core'
import { DashboardData, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import Dashboard from '@/components/Dashboard/Dashboard'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import getMonthlyData from '@/serverActions/getMonthlyData'
import getExpensesByCategory from '@/serverActions/getExpensesByCategory'
import getIncExpEvolution from '@/app/api/budget/getIncExpEvolution/getIncExpEvolutionAction'
import getMonthlyExpenseEvolution from '@/app/api/budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionAction'
import getTransactions from '@/app/api/budget/getTransactions/getTransactionsAction'
import { demoUserId } from '@/utils/CONSTANTS'

const englishMetadata = {
  title: 'Demo - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Demo - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

async function getInitialDemoData({ lang }: { lang: string }): Promise<DashboardData> {
  'use server'

  const curMonth = new Date().getMonth() + 1
  const curYear = new Date().getFullYear()
  const includeSavings = false
  const monthlyExpenseEvolution = await getMonthlyExpenseEvolution(curYear, curMonth, lang, includeSavings, true)
  const incExpEvolution = await getIncExpEvolution(curYear, curMonth, lang, true)
  const monthlyStats = await getMonthlyData(curYear, curMonth, true)
  const expensesByCategory = await getExpensesByCategory(curYear, curMonth, includeSavings, true)
  const transactions = await getTransactions(curYear, curMonth, true)

  return {
    monthlyExpenseEvolution,
    incExpEvolution,
    monthlyStats,
    expensesByCategory,
    transactions,
  }
}

export default async function DemoPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const initialData = await getInitialDemoData({ lang })

  return (
    <PageTransitionProvider>
      <Container fluid>
        <Flex gap="md" justify="center" align="center" direction="column">
          <Dashboard lang={lang} dictionary={dict} demo initialData={initialData} />
        </Flex>
      </Container>
    </PageTransitionProvider>
  )
}
