'use server'

import { db } from '@/utils/database'
import { validateUserId } from '@/utils/authUtils'

// returns the categories of a user that have been used for expense or savings transactions
export default async function getUsedCategories(userId: string, includeSavings: boolean): Promise<string[] | null> {
  const validatedUserId = await validateUserId(userId)

  let query = db.selectFrom('transactions').where('userId', '=', validatedUserId).where('isIncome', '=', false)

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
