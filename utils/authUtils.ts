'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { DEMOUSERID } from './CONSTANTS'

export const validateUserId = async (unsafeUserId: string): Promise<string> => {
  if (unsafeUserId === DEMOUSERID) {
    return DEMOUSERID
  }
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    throw new Error('No session found while validating user id!')
  }
  if (session.user.id !== unsafeUserId) {
    throw new Error('Queried user id does not match session id!')
  }
  return session.user.id
}

export const getUserId = async (): Promise<string | null> => {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return null
  }
  return session.user.id
}
