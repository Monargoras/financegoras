'use server'

import { db } from '@/utils/database'

// returns the categories of a user that have been used for expense or savings transactions
export default async function getUsedCategories(userId: string, includeSavings: boolean): Promise<string[] | null> {
  let query = db.selectFrom('transactions').where('userId', '=', userId).where('isIncome', '=', false)

  if (!includeSavings) {
    query = query.where('isSavings', '=', false)
  }

  const categories = await query.select(['category']).execute()

  if (!categories) {
    return null
  }

  const uniqueCategories = new Set<string>()
  categories.forEach((category) => {
    uniqueCategories.add(category.category)
  })

  return Array.from(uniqueCategories)
}
