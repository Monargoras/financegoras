'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { Categories } from '@/utils/types'
import { db } from '@/utils/database'

export default async function updateCategories(categories: Categories) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return false
  }

  const { id } = session.user

  // check if user has already set categories
  const userData = await db.selectFrom('userData').selectAll().where('userId', '=', id).executeTakeFirst()
  if (!userData) {
    const res = await db
      .insertInto('userData')
      .values({ userId: id, categories: JSON.stringify(categories) })
      .executeTakeFirst()
    return Number(res.numInsertedOrUpdatedRows) > 0
  }
  const res = await db
    .updateTable('userData')
    .set({ categories: JSON.stringify(categories) })
    .where('userId', '=', id)
    .executeTakeFirst()
  return Number(res.numUpdatedRows) > 0
}
