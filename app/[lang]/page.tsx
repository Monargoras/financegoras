import { Welcome } from '../../components/Welcome/Welcome'
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle'
import { PageProps } from '@/utils/types'
import { getDictionary } from './dictionaries'

export default async function HomePage({ params: { lang } }: PageProps) {
  const dict = await getDictionary(lang)

  return (
    <>
      <Welcome dictionary={dict} />
      <ColorSchemeToggle />
    </>
  )
}
