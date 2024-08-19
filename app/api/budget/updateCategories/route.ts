import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

/**
 * This endpoint updates the categories of the user
 * @allowedMethods POST
 * @body Categories object
 * @returns 200 if the categories were updated successfully, error otherwise
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()
  if (data === undefined || data === null) {
    return new Response('Missing required fields', { status: 400 })
  }

  const { id } = session.user

  // check if user has already set categories
  const userData = await db.selectFrom('userData').selectAll().where('userId', '=', id).executeTakeFirst()
  if (!userData) {
    const { insertId } = await db
      .insertInto('userData')
      .values({ userId: id, categories: JSON.stringify(data) })
      .executeTakeFirst()
    return Response.json({ code: insertId }, { status: 200 })
  }
  await db
    .updateTable('userData')
    .set({ categories: JSON.stringify(data) })
    .where('userId', '=', id)
    .executeTakeFirst()
  return Response.json({ code: '1' }, { status: 200 })
}
