'use client'

import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { Table, useMantineTheme } from '@mantine/core'
import { Categories, Dictionary, Transaction } from '@/utils/types'
import TransactionEditModal from '../TransactionsDetailTable/TransactionEditModal'
import generalClasses from '@/utils/general.module.css'

interface TransactionTableProps {
  dictionary: Dictionary
  demo: boolean
  data: Transaction[]
  categories: Categories | null
}

export function TransactionTable(props: TransactionTableProps) {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

  return (
    <>
      <Table.ScrollContainer h="45dvh" minWidth={300} className={generalClasses.styledScroll}>
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
                  c={ta.isIncome ? theme.colors.green[5] : ta.isSavings ? theme.colors.blue[5] : theme.colors.red[5]}
                >
                  {ta.isIncome ? '' : '-'}
                  {ta.amount.toFixed(2)}€
                </Table.Td>
                <Table.Td>{ta.name}</Table.Td>
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
