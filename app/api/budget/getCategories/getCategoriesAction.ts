'use server'

import { db } from '@/utils/database'
import { Categories } from '@/utils/types'

export default async function getCategories(userId: string): Promise<Categories | null> {
  const categories = await db
    .selectFrom('userData')
    .where('userId', '=', userId)
    .select(['categories'])
    .executeTakeFirst()

  if (!categories) {
    return null
  }

  return JSON.parse(categories.categories)
}
