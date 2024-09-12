'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { Categories } from '@/utils/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function getCategories(): Promise<Categories | null> {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return null
  }

  const userId = session.user.id

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
