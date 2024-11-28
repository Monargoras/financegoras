'use server'

import { db } from '@/utils/database'
import { getUserId } from '@/utils/authUtils'

export default async function updateTransactionCategories(oldCategory: string, newCategory: string) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }
  if (newCategory.length === 0) {
    return false
  }

  await db
    .updateTable('transactions')
    .set({
      category: newCategory,
    })
    .where((eb) => eb.and([eb('category', '=', oldCategory), eb('userId', '=', userId)]))
    .executeTakeFirst()
  return true
}
