import { getServerSession } from 'next-auth'
import { AnalysisDashboardData, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import AnalysisDashboardContainer from '@/components/AnalysisPage/AnalysisDashboardContainer'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'
import getAllTransactions from '@/app/api/transactions/getAllTransactions/getAllTransactionsAction'

const englishMetadata = {
  title: 'Analysis - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Analyse - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

async function getInitialAnalysisData(): Promise<AnalysisDashboardData> {
  'use server'

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { categories: null, transactions: [] }
  }
  const categories = await getCategories(session.user.id)
  const transactions = await getAllTransactions(session.user.id)

  return { categories, transactions }
}

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  const initialData = await getInitialAnalysisData()

  return (
    <PageTransitionProvider>
      {session?.user ? (
        <AnalysisDashboardContainer locale={lang} dictionary={dict} initialData={initialData} demo={false} />
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
