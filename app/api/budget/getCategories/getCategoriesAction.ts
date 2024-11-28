'use server'

import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { Categories } from '@/utils/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from '@/utils/CONSTANTS'

export default async function getCategories(userId: string): Promise<Categories | null> {
  const session = await getServerSession(authOptions)
  if ((!session || !session.user) && userId !== DEMOUSERID) {
    return []
  }
  const validatedUserId = userId === DEMOUSERID ? DEMOUSERID : session && session.user ? session.user.id : DEMOUSERID

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
