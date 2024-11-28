'use server'

import { db } from '@/utils/database'
import { UserSettings } from '@/utils/types'
import { getUserId } from '@/utils/authUtils'

export default async function getUserSettings(): Promise<UserSettings | null> {
  const userId = await getUserId()
  if (!userId) {
    return null
  }

  const res = await db
    .selectFrom('userData')
    .where('userId', '=', userId)
    .select(['grouped', 'percentage', 'includeSavings', 'includeEmptyCategories'])
    .executeTakeFirst()

  return res ?? null
}
