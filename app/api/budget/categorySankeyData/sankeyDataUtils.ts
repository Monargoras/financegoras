import { Categories, Transaction, TransactionType } from '@/utils/types'

// currently only woking for one month at a time, not yearly
export function aggregateByCategoryAndGroups(transactions: Transaction[], categories: Categories) {
  // get totals per group
  const groupTotals = categories
    .map((categoryGroup) => ({
      group: categoryGroup.group,
      total: transactions
        .filter((t) => categoryGroup.items.includes(t.category))
        .reduce((acc, t) => acc + (t.transactionType === TransactionType.Annual ? t.amount / 12 : t.amount), 0),
    }))
    .filter((group) => group.total > 0)

  // get totals per category
  const categoryTotals = categories
    .map((categoryGroup) => categoryGroup.items)
    .flat()
    .map((category) => ({
      category,
      total: transactions
        .filter((t) => t.category === category)
        .reduce((acc, t) => acc + (t.transactionType === TransactionType.Annual ? t.amount / 12 : t.amount), 0),
    }))
    .filter((category) => category.total > 0)

  return {
    groupTotals,
    categoryTotals,
  }
}
