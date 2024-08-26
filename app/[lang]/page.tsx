import { Welcome } from '../../components/Welcome/Welcome'
import { PageProps } from '@/utils/types'
import { getDictionary } from './dictionaries'
import DemoButton from '@/components/Welcome/DemoButton'

export default async function HomePage({ params: { lang } }: PageProps) {
  // get currently used dictionary
  const dict = await getDictionary(lang)

  return (
    <div
      style={{
        height: 'calc(100dvh - 60px)',
        margin: -16,
        backgroundSize: 'cover',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,100,200,0.75))',
      }}
    >
      <Welcome dictionary={dict} />
      <DemoButton dictionary={dict} />
    </div>
  )
}
