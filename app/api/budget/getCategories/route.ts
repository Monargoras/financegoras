import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import getCategories from './getCategoriesAction'

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

  const res = await getCategories(session.user.id)

  if (!res) {
    return new Response('Categories not found', { status: 404 })
  }

  return Response.json(res, { status: 200 })
}
