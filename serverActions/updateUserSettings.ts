'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/utils/database'
import { getUserId } from '@/utils/authUtils'

export default async function updateUserSettings(
  grouped: boolean,
  percentage: boolean,
  includeSavings: boolean,
  includeEmptyCategories: boolean
) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }

  const res = await db
    .updateTable('userData')
    .set({
      grouped,
      percentage,
      includeSavings,
      includeEmptyCategories,
    })
    .where('userId', '=', userId)
    .executeTakeFirst()

  revalidatePath('/[lang]/budget', 'page')

  return Number(res.numUpdatedRows) > 0
}
