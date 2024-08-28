import { Flex } from '@mantine/core'
import Welcome from '../../components/Welcome/Welcome'
import { PageProps } from '@/utils/types'
import { getDictionary } from './dictionaries'
import DemoButton from '@/components/Welcome/DemoButton'
import PageTransitionProvider from '@/components/ClientProviders/PageTransitionProvider'

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
      <PageTransitionProvider>
        <Welcome dictionary={dict} />
        <Flex justify="center">
          <DemoButton
            title={dict.landingPage.demo}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          />
        </Flex>
      </PageTransitionProvider>
    </div>
  )
}
