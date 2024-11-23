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

  // assert that all strings are less than 50 characters
  for (const group of categories) {
    if (group.group.length > 50) {
      return false
    }
    for (const category of group.items) {
      if (category.name.length > 50) {
        return false
      }
    }
  }

  // assert that all categories are unique
  const groupsArray = categories.map((group) => group.group)
  const categoriesArray = categories.map((group) => group.items.map((category) => category.name)).flat()
  if (new Set(groupsArray).size !== groupsArray.length || new Set(categoriesArray).size !== categoriesArray.length) {
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
