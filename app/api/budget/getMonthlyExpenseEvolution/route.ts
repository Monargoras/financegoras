import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { db } from '@/utils/database'
import { getTransactionType, MonthlyExpense, Transaction, TransactionType } from '@/utils/types'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { calculateTotalPerMonth } from '../getAggregatedTransactions/route'

const getMonthlyExpenseDataOneMonth = async (
  month: number,
  year: number,
  ofIncome: boolean,
  calcPercentage: boolean,
  userId: string
) => {
  const incomeRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', true)
    .execute()

  const expenseRes = await db
    .selectFrom('transactions')
    .selectAll()
    .where('userId', '=', userId)
    .where('createdAt', '<', month ? new Date(`${year}-${month + 1}-01`) : new Date(`${year + 1}-01-01`))
    .where((eb) =>
      eb('stoppedAt', 'is', null).or(
        'stoppedAt',
        '>',
        month ? new Date(`${year}-${month}-01`) : new Date(`${year}-01-01`)
      )
    )
    .where('isIncome', '=', false)
    .execute()

  // transform transaction type to enum
  const incomeTransactions: Transaction[] = incomeRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const expenseTransactions: Transaction[] = expenseRes.map((transaction) => ({
    ...transaction,
    transactionType: getTransactionType(transaction.transactionType),
  }))

  const expensesPerCategory = expenseTransactions.reduce(
    (acc, transaction) => {
      const { category } = transaction
      // timeframe month: annual transactions are divided by 12
      if (month && transaction.transactionType === TransactionType.Annual) {
        acc[category] = (acc[category] || 0) + transaction.amount / 12
        return acc
      }
      // timeframe year: monthly transactions are multiplied by 12
      if (!month && transaction.transactionType === TransactionType.Monthly) {
        acc[category] = (acc[category] || 0) + transaction.amount * 12
        return acc
      }
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    },
    {} as Record<string, number>
  )

  const totalIncome = parseFloat(calculateTotalPerMonth(incomeTransactions))

  const totalExpense = parseFloat(calculateTotalPerMonth(expenseTransactions))

  const expensesOneMonthArray = Object.entries(expensesPerCategory).map(([category, total]) => ({
    [category]: calcPercentage
      ? ((total / (ofIncome ? totalIncome : totalExpense)) * 100).toFixed(2)
      : total.toFixed(2),
  }))

  // transform array to object with all categories for the given month
  const expensesOneMonth = expensesOneMonthArray.reduce(
    (acc, obj) => {
      const key = Object.keys(obj)[0]
      acc[key] = parseFloat(obj[key])
      return acc
    },
    { month: new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' }) } as Record<
      string,
      number | string
    >
  )

  return expensesOneMonth as MonthlyExpense
}

const getMonthYearTuples = (month: number | null, year: number) => {
  if (!month) {
    return [
      [1, year],
      [2, year],
      [3, year],
      [4, year],
      [5, year],
      [6, year],
      [7, year],
      [8, year],
      [9, year],
      [10, year],
      [11, year],
      [12, year],
    ]
  }
  const array = []
  for (let i = month; i > 0; i -= 1) {
    array.push([i, year])
  }
  let index = 0
  while (array.length < 12) {
    array.push([12 - index, year - 1])
    index += 1
  }
  return array.reverse()
}

const valueToBoolean = (value: string | null) => {
  if (value === null) {
    return null
  }
  if (typeof value === 'boolean') {
    return value
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false
  }
  return null
}

/**
 * This endpoint returns the evolution of expenses per category the last 12 months or the given year
 * @allowedMethods GET
 * @param month - the month of the year (optional)
 * @param year - the year
 * @param ofIncome - if true, the expenses are calculated as a percentage of the income
 * @param percentage - if true, the expenses are calculated as a percentage, otherwise as a sum
 * @returns body containing MonthlyExpenseEvolution
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monthString = request.nextUrl.searchParams.get('month')
  const yearString = request.nextUrl.searchParams.get('year')
  const ofIncome = valueToBoolean(request.nextUrl.searchParams.get('ofIncome'))
  const percentage = valueToBoolean(request.nextUrl.searchParams.get('percentage'))

  if (!yearString || ofIncome === null || percentage === null) {
    return new Response('More fields is required', { status: 400 })
  }

  const month = monthString ? parseInt(monthString, 10) : null
  const year = parseInt(yearString, 10)

  const monthsToCompute = getMonthYearTuples(month, year)
  // get the expenses for the last 12 months or the given year
  const expenses = await Promise.all(
    monthsToCompute.map(([m, y]) => getMonthlyExpenseDataOneMonth(m, y, ofIncome, percentage, session.user.id))
  )

  return new Response(JSON.stringify(expenses), { status: 200 })
}
