'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

// returns the categories of a user that have been used for expense or savings transactions
export default async function getUsedCategories(userId: string, includeSavings: boolean): Promise<string[] | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return null
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

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
