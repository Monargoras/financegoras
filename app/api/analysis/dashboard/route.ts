import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { demoUserId } from '@/utils/CONSTANTS'
import { valueToBoolean } from '../../budget/getMonthlyExpenseEvolution/getMonthlyExpenseEvolutionUtils'
import getAnalysisDashbaordData from './getAnalysisDashbaordDataAction'

/**
 * This endpoint returns the evolution of expenses per category the last 12 months or the given year
 * @allowedMethods GET
 * @param names - array of transaction names
 * @param categories - array of categories
 * @param groups - array of groups
 * @param types - array of transaction types
 * @param startDate - start date of the date range
 * @param endDate - end date of the date range
 * @param lang - the current language used by user for month names
 * @param demo - set if demo data is requested
 * @returns body containing DasboardData
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const isDemo = valueToBoolean(request.nextUrl.searchParams.get('demo'))
  if ((!session || !session.user) && !isDemo) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session && session.user && !isDemo ? session.user.id : demoUserId

  const namesString = request.nextUrl.searchParams.get('names')
  const categoriesString = request.nextUrl.searchParams.get('categories')
  const groupsString = request.nextUrl.searchParams.get('groups')
  const typesString = request.nextUrl.searchParams.get('types')
  const startDateString = request.nextUrl.searchParams.get('startDate')
  const endDateString = request.nextUrl.searchParams.get('endDate')
  const lang = request.nextUrl.searchParams.get('lang') ?? 'en'

  const names = namesString ? namesString.split(',') : []
  const categories = categoriesString ? categoriesString.split(',') : []
  const groups = groupsString ? groupsString.split(',') : []
  const types = typesString ? typesString.split(',') : []

  const res = await getAnalysisDashbaordData(
    userId,
    names,
    categories,
    groups,
    types,
    startDateString,
    endDateString,
    lang
  )

  return new Response(JSON.stringify(res), { status: 200 })
}
