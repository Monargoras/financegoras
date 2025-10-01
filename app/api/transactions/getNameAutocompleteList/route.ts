import { getUserId } from '@/utils/authUtils'
import getNameAutocompleteList from './getNameAutocompleteListAction'

/**
 * This endpoint returns the unique string array sorted by number of duplicates of all transaction names
 * @allowedMethods GET
 * @returns body containing the array for the logged in user
 */
export async function GET() {
  const userId = await getUserId()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await getNameAutocompleteList(userId)

  return Response.json(res, { status: 200 })
}
