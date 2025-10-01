import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'

export async function generateMetadata(props: { params: PageProps }): Promise<Metadata> {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return {
    title: dict.general.metadataNotFoundTitle,
    description: dict.landingPage.introText,
  }
}

export default async function CatchAllPage() {
  notFound()
}
