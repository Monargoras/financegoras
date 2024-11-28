import getCategories from './getCategoriesAction'
import { getUserId } from '@/utils/authUtils'

/**
 * This endpoint returns the categories of the user
 * @allowedMethods GET
 * @returns body containing the categories of the user
 */
export async function GET() {
  const userId = await getUserId()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await getCategories(userId)

  if (!res) {
    return new Response('Categories not found', { status: 404 })
  }

  return Response.json(res, { status: 200 })
}
