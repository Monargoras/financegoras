import { AnalysisDashboardDTO, PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import AuthenticationPrompt from '@/components/AuthenticationPrompt/AuthenticationPrompt'
import AnalysisDashboardContainer from '@/components/AnalysisPage/AnalysisDashboardContainer'
import getAnalysisDashbaordData from '@/app/api/analysis/dashboard/getAnalysisDashbaordDataAction'
import { getUserId } from '@/utils/authUtils'
import { emptyData } from '@/app/api/analysis/dashboard/analysisDashboardUtils'

export async function generateMetadata(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.analysisPage.metadataPageTitle,
    description: dict.landingPage.introText,
  }
}

async function getInitialAnalysisData(lang: string): Promise<AnalysisDashboardDTO> {
  'use server'

  const userId = await getUserId()
  if (!userId) {
    return emptyData
  }
  const data = await getAnalysisDashbaordData(
    userId,
    [],
    [],
    [],
    [],
    new Date(new Date().setMonth(new Date().getMonth() - 11)).toUTCString(),
    new Date().toUTCString(),
    true,
    lang
  )

  return data ?? emptyData
}

export default async function BudgetPage(props: { params: PageProps }) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  const userId = await getUserId()
  const initialData = await getInitialAnalysisData(lang)

  return (
    <PageTransitionProvider>
      {userId ? (
        <AnalysisDashboardContainer locale={lang} dictionary={dict} initialData={initialData} demo={false} />
      ) : (
        <AuthenticationPrompt dictionary={dict} />
      )}
    </PageTransitionProvider>
  )
}
