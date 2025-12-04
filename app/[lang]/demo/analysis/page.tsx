import { Metadata } from 'next'
import { AnalysisDashboardDTO, PageProps } from '@/utils/types'
import { getDictionary } from '../../dictionaries'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'
import AnalysisDashboardContainer from '@/components/AnalysisPage/AnalysisDashboardContainer'
import getAnalysisDashbaordData from '@/app/api/analysis/dashboard/getAnalysisDashbaordDataAction'
import { DEMOUSERID } from '@/utils/CONSTANTS'
import { emptyData } from '@/app/api/analysis/dashboard/analysisDashboardUtils'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: PageProps }): Promise<Metadata> {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.analysisPage.metadataDemoTitle,
    description: dict.landingPage.introText,
  }
}

async function getInitialAnalysisData(lang: string): Promise<AnalysisDashboardDTO> {
  'use server'

  const data = await getAnalysisDashbaordData(
    DEMOUSERID,
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
  const initialData = await getInitialAnalysisData(lang)

  return (
    <PageTransitionProvider>
      <AnalysisDashboardContainer locale={lang} dictionary={dict} initialData={initialData} demo />
    </PageTransitionProvider>
  )
}
