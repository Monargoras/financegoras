'use server'

import { nanoid } from 'nanoid'
import { TransactionType } from '@/utils/types'
import { db } from '@/utils/database'
import getCategories from '@/app/api/budget/getCategories/getCategoriesAction'

export default async function generateDemoTransactions(year: number, month: number) {
  const categories = await getCategories('DEMO')

  if (!categories) {
    return false
  }

  // add christmas bonus transaction in december
  if (month === 0) {
    const id = nanoid(16)
    const date = new Date(year, month - 1, 24)
    const transaction = {
      isIncome: true,
      isSavings: false,
      amount: 1537,
      name: 'Christmas Bonus',
      category: 'Bonus',
      userId: 'DEMO',
      id,
      createdAt: date,
      transactionType: TransactionType[TransactionType.Single],
      stoppedAt: date,
    }
    await db.insertInto('transactions').values(transaction).executeTakeFirst()

    // add savings transaction in december
    const id2 = nanoid(16)
    const date2 = new Date(year, month - 1, 26)
    const transaction2 = {
      isIncome: false,
      isSavings: true,
      amount: 750,
      name: 'Savings account bonus',
      category: 'Investment',
      userId: 'DEMO',
      id: id2,
      createdAt: date2,
      transactionType: TransactionType[TransactionType.Single],
      stoppedAt: date2,
    }
    await db.insertInto('transactions').values(transaction2).executeTakeFirst()
  }

  // add tax return transaction in may
  if (month === 5) {
    const id = nanoid(16)
    const date = new Date(year, month - 1, 15)
    const transaction = {
      isIncome: true,
      isSavings: false,
      amount: 1337,
      name: 'Tax Return',
      category: 'Infrequent',
      userId: 'DEMO',
      id,
      createdAt: date,
      transactionType: TransactionType[TransactionType.Single],
      stoppedAt: date,
    }
    await db.insertInto('transactions').values(transaction).executeTakeFirst()

    // add savings transaction in may
    const id2 = nanoid(16)
    const date2 = new Date(year, month - 1, 17)
    const transaction2 = {
      isIncome: false,
      isSavings: true,
      amount: 500,
      name: 'Savings account bonus',
      category: 'Investment',
      userId: 'DEMO',
      id: id2,
      createdAt: date2,
      transactionType: TransactionType[TransactionType.Single],
      stoppedAt: date2,
    }
    await db.insertInto('transactions').values(transaction2).executeTakeFirst()
  }

  // get random number between 10 and 20
  const numberOfTransactions = Math.floor(Math.random() * 10) + 10

  // filter "Investment","Salary","Bonus","Infrequent" as they dont make sense for expenses
  categories.forEach((c) => {
    c.items = c.items.filter((i) => !['Investment', 'Salary', 'Bonus', 'Infrequent'].includes(i.name))
  })

  for (let i = 0; i < numberOfTransactions; i += 1) {
    const id = nanoid(16)
    const randomDay = Math.floor(Math.random() * 28) + 1
    const amount = Math.floor(Math.random() * 70) + 1
    const randomGroup = Math.floor(Math.random() * categories.length)
    const randomCategory = Math.floor(Math.random() * categories[randomGroup].items.length)
    const category = categories[randomGroup].items[randomCategory]
    const name = `${category} ${randomDay}`
    const date = new Date(year, month - 1, randomDay)
    const transaction = {
      isIncome: false,
      isSavings: false,
      amount,
      name,
      category: category.name,
      userId: 'DEMO',
      id,
      createdAt: date,
      transactionType: TransactionType[TransactionType.Single],
      stoppedAt: date,
    }
    await db.insertInto('transactions').values(transaction).executeTakeFirst()
  }
  return true
}
