'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { db } from '@/utils/database'
import { UserSettings } from '@/utils/types'

export default async function getUserSettings(): Promise<UserSettings | null> {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return null
  }

  const res = await db
    .selectFrom('userData')
    .where('userId', '=', session.user.id)
    .select(['grouped', 'percentage', 'includeSavings', 'includeEmptyCategories'])
    .executeTakeFirst()

  return res ?? null
}
