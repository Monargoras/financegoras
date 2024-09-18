'use server'

import { CategorySankeyData } from '@/utils/types'
import { fetchIncExpSavTransactions } from '../getAggregatedTransactions/fetchIncExpSavTransactions'
import getCategories from '../getCategories/getCategoriesAction'
import { aggregateByCategoryAndGroups } from './sankeyDataUtils'

export default async function getCategorySankeyData(
  userId: string,
  year: number,
  month: number | null
): Promise<CategorySankeyData> {
  const { incomeTransactions, expenseTransactions, savingsTransactions } = await fetchIncExpSavTransactions(
    userId,
    year,
    month
  )

  const categories = await getCategories(userId)

  if (categories === null) {
    return {
      nodes: [],
      links: [],
    }
  }

  const incomeData = aggregateByCategoryAndGroups(incomeTransactions, categories)
  const expenseData = aggregateByCategoryAndGroups(expenseTransactions, categories)
  const savingsData = aggregateByCategoryAndGroups(savingsTransactions, categories)

  const nodes: { name: string; type: 'savings' | 'income' | 'expenses' }[] = []
  const links: { source: number; target: number; value: number; type: 'savings' | 'income' | 'expenses' }[] = []

  incomeData.categoryTotals.forEach((category, index) => {
    nodes.push({ name: category.category, type: 'income' })
    links.push({ source: index, target: incomeData.categoryTotals.length, value: category.total, type: 'income' })
  })

  incomeData.groupTotals.forEach((group, index) => {
    if (group.total === links[links.length - 1].value) return
    nodes.push({ name: group.group, type: 'income' })
    links.push({
      source: incomeData.categoryTotals.length + index,
      target: incomeData.categoryTotals.length + incomeData.groupTotals.length,
      value: group.total,
      type: 'income',
    })
  })

  nodes.push({ name: 'Budget', type: 'income' })

  const budgetIndex = nodes.length - 1

  expenseData.groupTotals.forEach((group, index) => {
    if (!nodes.find((n) => n.name === group.group)) {
      nodes.push({ name: group.group, type: 'expenses' })
    }
    links.push({
      source: budgetIndex,
      target: budgetIndex + index + 1,
      value: group.total,
      type: 'expenses',
    })
  })

  savingsData.groupTotals.forEach((group, index) => {
    if (!nodes.find((n) => n.name === group.group)) {
      nodes.push({ name: group.group, type: 'savings' })
      links.push({
        source: budgetIndex,
        target: budgetIndex + expenseData.groupTotals.length + index + 1,
        value: group.total,
        type: 'savings',
      })
    } else {
      links.push({
        source: budgetIndex,
        target: nodes.findIndex((n) => n.name === group.group),
        value: group.total,
        type: 'savings',
      })
    }
  })

  expenseData.categoryTotals.forEach((category) => {
    nodes.push({ name: category.category, type: 'expenses' })
    const groupName = categories.find((c) => c.items.includes(category.category))!.group
    links.push({
      source: nodes.findIndex((n) => n.name === groupName),
      target: nodes.length - 1,
      value: category.total,
      type: 'expenses',
    })
  })

  savingsData.categoryTotals.forEach((category) => {
    nodes.push({ name: category.category, type: 'savings' })
    const groupName = categories.find((c) => c.items.includes(category.category))!.group
    links.push({
      source: nodes.findIndex((n) => n.name === groupName),
      target: nodes.length - 1,
      value: category.total,
      type: 'savings',
    })
  })

  /*const printLinks = links.map((link) => ({
    source: nodes[link.source].name,
    target: nodes[link.target].name,
    value: link.value,
    type: link.type,
  }))
  console.log(printLinks)*/

  return {
    nodes,
    links,
  }
}
