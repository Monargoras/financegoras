import { getServerSession } from 'next-auth'
import { db } from '@/utils/database'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

/**
 * This endpoint returns the categories of the user
 * @allowedMethods GET
 * @returns body containing the categories of the user
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const categories = await db
    .selectFrom('userData')
    .where('userId', '=', session.user.id)
    .select(['categories'])
    .executeTakeFirst()

  if (!categories) {
    return new Response('Categories not found', { status: 404 })
  }

  return Response.json(JSON.parse(categories.categories), { status: 200 })
}
