'use client'

import { Button, Checkbox, Flex, Modal, Text } from '@mantine/core'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { useSWRConfig } from 'swr'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { Dictionary, Transaction, TransactionDTO } from '@/utils/types'
import importTransactions from '@/serverActions/importTransactions'

interface ImportModalProps {
  dictionary: Dictionary
  opened: boolean
  close: () => void
  transactions: Transaction[]
}

export default function ImportModal(props: ImportModalProps) {
  const { mutate } = useSWRConfig()
  const isMobile = useMediaQuery('(max-width: 50em)')
  const [checked, setChecked] = useState(false)

  const handleImport = async () => {
    const transactionDTOs: TransactionDTO[] = props.transactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      category: tx.category,
      createdAt: tx.createdAt.toUTCString(),
      isIncome: tx.isIncome,
      isSavings: tx.isSavings,
      name: tx.name,
      stoppedAt: tx.stoppedAt ? tx.stoppedAt.toUTCString() : null,
      transactionType: tx.transactionType,
    }))
    const numberOfInserted = await importTransactions(transactionDTOs, checked)
    if (numberOfInserted) {
      notifications.show({
        title: props.dictionary.transactionsPage.successfullyImportedTransactionsTitle,
        message: props.dictionary.transactionsPage.successfullyImportedTransactionsMessage.replace(
          '{{numTransactions}}',
          numberOfInserted.toString()
        ),
        color: 'green',
        icon: <IconCheck />,
        position: 'bottom-right',
      })
      mutate((key) => typeof key === 'string' && key.startsWith('/api/budget/') && key !== '/api/budget/getCategories')
      mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/analysis/'))
      return true
    }
    notifications.show({
      title: props.dictionary.transactionsPage.importErrorTitle,
      message: props.dictionary.transactionsPage.importErrorMessage,
      color: 'red',
      icon: <IconX />,
      position: 'bottom-right',
    })
    return false
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      title={props.dictionary.transactionsPage.csvImportSuccessTitle}
      fullScreen={isMobile}
      size="xl"
    >
      <Flex justify="center" align="center" gap="md" direction="column" wrap="wrap">
        <Text>
          {props.dictionary.transactionsPage.csvImportSuccessMessage.replace(
            '{{numTransactions}}',
            props.transactions.length.toString()
          )}
        </Text>
        <Checkbox
          label={props.dictionary.transactionsPage.truncateExistingData}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <Button variant="outline" color="green" onClick={props.close}>
            {props.dictionary.budgetPage.cancel}
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={async () => {
              const success = await handleImport()
              if (success) {
                props.close()
              }
            }}
          >
            {props.dictionary.transactionsPage.performImport}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
