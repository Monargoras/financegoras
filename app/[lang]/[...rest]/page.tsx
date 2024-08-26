import { notFound } from 'next/navigation'
import de from '@/dictionaries/de.json'
import en from '@/dictionaries/en.json'

const englishMetadata = {
  title: 'Not Found - Financegoras',
  description: en.landingPage.introText,
}

const germanMetadata = {
  title: 'Nicht Gefunden - Financegoras',
  description: de.landingPage.introText,
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'de' ? germanMetadata : englishMetadata
}

export default async function CatchAllPage() {
  notFound()
}
