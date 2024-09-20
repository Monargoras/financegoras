'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { db } from '@/utils/database'

export default async function updateUserSettings(
  grouped: boolean,
  percentage: boolean,
  includeSavings: boolean,
  includeEmptyCategories: boolean
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
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
    .where('userId', '=', session.user.id)
    .executeTakeFirst()

  return Number(res.numUpdatedRows) > 0
}
