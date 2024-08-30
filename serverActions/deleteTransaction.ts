'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { db } from '@/utils/database'

export default async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return false
  }

  await db
    .deleteFrom('transactions')
    .where((eb) => eb.and([eb('id', '=', id), eb('userId', '=', session.user.id)]))
    .executeTakeFirst()
  return true
}
