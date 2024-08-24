import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { calculateTotalPerMonth, calculateTotalPerYear } from './calculateTotals'
import { fetchIncExpSavTransactions } from './fetchIncExpSavTransactions'

/**
 * This endpoint returns the aggregated transactions from the database for given timeframe
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @returns body containing AggregatedIncomeExpenseTotals
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')

  if (!yearString) {
    return new Response('Year is required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const { incomeTransactions, expenseTransactions, savingsTransactions } = await fetchIncExpSavTransactions(
    session.user.id,
    year,
    month
  )

  const totalIncome = month ? calculateTotalPerMonth(incomeTransactions) : calculateTotalPerYear(incomeTransactions)
  const totalExpenses = month ? calculateTotalPerMonth(expenseTransactions) : calculateTotalPerYear(expenseTransactions)
  const totalSavings = month ? calculateTotalPerMonth(savingsTransactions) : calculateTotalPerYear(savingsTransactions)

  return Response.json({ totalIncome, totalExpenses, totalSavings }, { status: 200 })
}
