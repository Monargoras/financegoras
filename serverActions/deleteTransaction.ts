'use server'

import { db } from '@/utils/database'
import { getUserId } from '@/utils/authUtils'

export default async function deleteTransaction(id: string) {
  const userId = await getUserId()
  if (!userId) {
    return false
  }

  const res = await db
    .deleteFrom('transactions')
    .where((eb) => eb.and([eb('id', '=', id), eb('userId', '=', userId)]))
    .executeTakeFirst()

  return Number(res.numDeletedRows) > 0
}
