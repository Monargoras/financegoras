'use server'

import { db } from '@/utils/database'
import { sortAndDeduplicate } from '@/utils/helpers'
import { validateUserId } from '@/utils/authUtils'

export default async function getNameAutocompleteList(userId: string): Promise<string[]> {
  const validatedUserId = await validateUserId(userId)

  const transactions = await db
    .selectFrom('transactions')
    .where('userId', '=', validatedUserId)
    .orderBy('createdAt', 'desc')
    .select(['name'])
    .execute()

  const res = sortAndDeduplicate(transactions.map((t) => t.name))

  return res
}
