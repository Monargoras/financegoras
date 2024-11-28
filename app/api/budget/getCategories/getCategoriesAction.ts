'use server'

import { db } from '@/utils/database'
import { Categories } from '@/utils/types'
import { validateUserId } from '@/utils/authUtils'

export default async function getCategories(userId: string): Promise<Categories | null> {
  const validatedUserId = await validateUserId(userId)

  const categories = await db
    .selectFrom('userData')
    .where('userId', '=', validatedUserId)
    .select(['categories'])
    .executeTakeFirst()

  if (!categories) {
    return null
  }

  return JSON.parse(categories.categories)
}
