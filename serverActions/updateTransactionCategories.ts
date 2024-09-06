'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { db } from '@/utils/database'

export default async function updateTransactionCategories(oldCategory: string, newCategory: string) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
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
    .where((eb) => eb.and([eb('category', '=', oldCategory), eb('userId', '=', session.user.id)]))
    .executeTakeFirst()
  return true
}
