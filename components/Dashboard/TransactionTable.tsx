'use client'

import { useDisclosure } from '@mantine/hooks'
import { useState, useContext } from 'react'
import { alpha, Table, useMantineTheme } from '@mantine/core'
import { Categories, Dictionary, Transaction, TransactionType } from '@/utils/types'
import TransactionEditModal from '../TransactionsDetailTable/TransactionEditModal'
import generalClasses from '@/utils/general.module.css'
import { PrivacyModeContext } from '@/components/ClientProviders/ClientProviders'

interface TransactionTableProps {
  dictionary: Dictionary
  demo: boolean
  data: Transaction[]
  categories: Categories | null
  selectedMonth?: number
  selectedYear?: number
}

export function TransactionTable(props: TransactionTableProps) {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
  const { privacyMode } = useContext(PrivacyModeContext)

  // function that checks if day of month is already in the past and returns the alpha value for the color that should be used
  // if the transaction is in the future or it is annual and not payed this month, the color is faded
  const isPastDayOfMonth = (ta: Transaction) => {
    const currentDate = new Date()
    // if selected month is current month, use current date, otherwise use last day of selected month
    const lastDayOfSelectedMonth =
      currentDate.getFullYear() === props.selectedYear && currentDate.getMonth() === props.selectedMonth
        ? currentDate
        : new Date(
            props.selectedYear ?? currentDate.getFullYear(),
            (props.selectedMonth ?? currentDate.getMonth()) + 1,
            0
          )
    const createdAt = new Date(ta.createdAt)

    const isCurMonthAndFuture =
      currentDate.getFullYear() === props.selectedYear &&
      currentDate.getMonth() === props.selectedMonth &&
      currentDate.getDate() < createdAt.getDate()

    const isAnnualAndNotThisMonth =
      ta.transactionType === TransactionType.Annual &&
      (props.selectedMonth !== createdAt.getMonth() ||
        (props.selectedMonth === createdAt.getMonth() && lastDayOfSelectedMonth.getDate() < createdAt.getDate()))

    return isCurMonthAndFuture || isAnnualAndNotThisMonth ? 0.6 : 1
  }

  return (
    <>
      <Table.ScrollContainer
        h="40dvh"
        miw={{ xl: 600, md: 350 }}
        minWidth={350}
        className={generalClasses.styledScroll}
      >
        <Table striped highlightOnHover stickyHeader withTableBorder stickyHeaderOffset={-1}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{props.dictionary.budgetPage.amount}</Table.Th>
              <Table.Th>{props.dictionary.budgetPage.name}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {props.data.map((ta: Transaction) => (
              <Table.Tr
                key={ta.id}
                onClick={() => {
                  if (!props.demo) {
                    setEditTransaction(ta)
                    open()
                  }
                }}
                style={{ cursor: props.demo ? 'default' : 'pointer' }}
              >
                <Table.Td
                  c={alpha(
                    ta.isIncome
                      ? theme.colors.income[5]
                      : ta.isSavings
                        ? theme.colors.saving[5]
                        : theme.colors.expense[5],
                    isPastDayOfMonth(ta)
                  )}
                >
                  {ta.isIncome ? '' : '-'}
                  {privacyMode ? '**.**' : ta.amount.toFixed(2)}€
                </Table.Td>
                <Table.Td c={isPastDayOfMonth(ta) === 1 ? undefined : alpha(theme.colors.gray[5], 0.6)}>
                  {ta.name}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {!props.demo && editTransaction && (
        <TransactionEditModal
          dictionary={props.dictionary}
          opened={opened}
          close={() => {
            setEditTransaction(null)
            close()
          }}
          transaction={editTransaction}
          categories={props.categories ?? []}
        />
      )}
    </>
  )
}
