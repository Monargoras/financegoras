import { Text } from '@mantine/core'
import { PageProps } from '@/utils/types'
import { getDictionary } from '../dictionaries'

export default async function BudgetPage({ params: { lang } }: PageProps) {
  // get currently used dictionary
  const dict = await getDictionary(lang)

  return (
    <>
      <Text>{dict.budgetPage.budgetBook}</Text>
    </>
  )
}
