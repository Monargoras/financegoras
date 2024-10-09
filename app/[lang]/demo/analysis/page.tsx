import { AnalysisDashboardData, PageProps } from '@/utils/types'
import { getDictionary } from '../../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'
import AnalysisDashboardContainer from '@/components/AnalysisPage/AnalysisDashboardContainer'
import getAnalysisDashbaordData from '@/app/api/analysis/dashboard/getAnalysisDashbaordDataAction'
import { demoUserId } from '@/utils/CONSTANTS'

const englishMetadata = {
  title: 'Analysis Demo - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Analysedemo - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

async function getInitialAnalysisData(lang: string): Promise<AnalysisDashboardData> {
  'use server'

  const data = await getAnalysisDashbaordData(
    demoUserId,
    [],
    [],
    [],
    [],
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    new Date(),
    lang
  )

  return (
    data ?? {
      categories: [],
      transactions: [],
      listOfNames: [],
      categoryEvolutionData: [],
      colorMap: {},
      statsBoardData: {
        totalFiltered: {
          expenses: 0,
          income: 0,
          savings: 0,
        },
        averagePerMonth: {
          expenses: 0,
          expensesPercentage: 0,
          income: 0,
          savings: 0,
          savingsPercentage: 0,
        },
        maximumOneMonth: {
          expenses: 0,
          expensesPercentage: 0,
          income: 0,
          savings: 0,
          savingsPercentage: 0,
        },
        minimumOneMonth: {
          expenses: 0,
          expensesPercentage: 0,
          income: 0,
          savings: 0,
          savingsPercentage: 0,
        },
      },
    }
  )
}

export default async function BudgetPage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)
  const initialData = await getInitialAnalysisData(lang)

  return (
    <PageTransitionProvider>
      <AnalysisDashboardContainer locale={lang} dictionary={dict} initialData={initialData} demo />
    </PageTransitionProvider>
  )
}
