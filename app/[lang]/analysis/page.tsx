import { getServerSession } from 'next-auth'
import { AnalysisDashboardData, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import AnalysisDashboardContainer from '@/components/AnalysisPage/AnalysisDashboardContainer'
import getAnalysisDashbaordData from '@/app/api/analysis/dashboard/getAnalysisDashbaordDataAction'

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

  const emptyData = {
    categories: [],
    transactions: [],
    listOfNames: [],
    categoryEvolutionData: [],
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return emptyData
  }
  const data = await getAnalysisDashbaordData(session.user.id, [], [], [], [], null, null, 'en')

  return data ?? emptyData
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
