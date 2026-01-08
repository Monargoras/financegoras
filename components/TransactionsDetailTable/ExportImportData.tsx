'use client'

import { useRef, useState } from 'react'
import { ActionIcon, Box, CopyButton, Tooltip } from '@mantine/core'
import {
  IconCheck,
  IconFileDownloadFilled,
  IconFileUploadFilled,
  IconX,
  IconCategoryMinus,
  IconCategoryPlus,
  IconCopyCheckFilled,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import Papa from 'papaparse'
import { Categories, Dictionary, EXPORT_ORDER, Transaction, TransactionType } from '@/utils/types'
import ImportModal from './ImportModal'
import CategoryImportModal from './CategoryImportModal'

interface ExportImportDataProps {
  dictionary: Dictionary
  transactions: Transaction[]
  categories: Categories
}

export default function ExportImportData(props: ExportImportDataProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openedImportModal, importModalControls] = useDisclosure(false)
  const [openedCategoryModal, categoryModalControls] = useDisclosure(false)

  const convertTransaction = <T extends keyof Transaction>(
    transaction: Transaction,
    headers: T[]
  ): (string | number | boolean | null)[] =>
    headers.map((key) => {
      const value = transaction[key]
      if (key === 'transactionType') {
        return TransactionType[value as TransactionType] // convert enum to string
      }
      if (key === 'createdAt' || (key === 'stoppedAt' && value !== null)) {
        return new Date(value as string).toISOString()
      }
      if (value === null) {
        return 'null'
      }
      return value as string | number | boolean
    })

  const downloadCSV = () => {
    // Convert the data array into a CSV string
    const csvString = [
      EXPORT_ORDER, // Specify your headers here
      ...props.transactions.map((item) => convertTransaction(item, EXPORT_ORDER)), // Map your data fields accordingly
    ]
      .map((row) => row.join(','))
      .join('\n')

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' })

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financegoras-${new Date().toISOString()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const uploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    Papa.parse(file, {
      header: true, // first row = headers
      skipEmptyLines: true,
      complete: (results) => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        const parsedData = results.data as Record<string, string>[]
        const csvHeaders = results.meta.fields ?? []

        // Validate required headers
        const missingHeaders = EXPORT_ORDER.filter((col) => !csvHeaders.includes(col as string))

        if (missingHeaders.length > 0) {
          notifications.show({
            title: props.dictionary.transactionsPage.csvValidationErrorTitle,
            message: props.dictionary.transactionsPage.csvValidationErrorMessageMissingHeaders.replace(
              '{{missingHeaders}}',
              missingHeaders.join(', ')
            ),
            color: 'red',
            icon: <IconX />,
            position: 'bottom-right',
          })
          setTransactions([])
          return
        }

        try {
          const txs: Transaction[] = parsedData.map((row, index) => {
            // field-level validation
            if (!row.id || !row.name || !row.category) {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorMissingText.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }
            if (Number.isNaN(parseFloat(row.amount))) {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorInvalidAmount.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }
            if (row.isIncome !== 'true' && row.isIncome !== 'false') {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorInvalidIsIncome.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }
            if (row.isSavings !== 'true' && row.isSavings !== 'false') {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorInvalidIsSavings.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }
            if (!(row.transactionType in TransactionType)) {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorInvalidTransactionType.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }
            if (Number.isNaN(Date.parse(row.createdAt))) {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorInvalidCreatedAtDate.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }
            if (row.stoppedAt && Number.isNaN(Date.parse(row.stoppedAt)) && row.stoppedAt !== 'null') {
              throw new Error(
                props.dictionary.transactionsPage.csvValidationErrorInvalidStoppedAtDate.replace(
                  '{{rowNumber}}',
                  (index + 1).toString()
                )
              )
            }

            return {
              id: 'TBD',
              isIncome: row.isIncome === 'true',
              isSavings: row.isSavings === 'true',
              amount: parseFloat(row.amount),
              createdAt: new Date(row.createdAt),
              name: row.name,
              category: row.category,
              transactionType: TransactionType[row.transactionType as keyof typeof TransactionType],
              stoppedAt: row.stoppedAt ? new Date(row.stoppedAt) : null,
            }
          })

          setTransactions(txs)
          importModalControls.open()
          notifications.show({
            title: props.dictionary.transactionsPage.csvImportSuccessTitle,
            message: props.dictionary.transactionsPage.csvImportSuccessMessage.replace(
              '{{numTransactions}}',
              txs.length.toString()
            ),
            color: 'green',
            icon: <IconCheck />,
            position: 'bottom-right',
          })
        } catch (err) {
          notifications.show({
            title: props.dictionary.transactionsPage.csvValidationErrorTitle,
            message:
              typeof err === 'object' && err !== null && 'message' in err
                ? String((err as { message: unknown }).message)
                : props.dictionary.transactionsPage.csvValidationErrorMessageFallback,
            color: 'red',
            icon: <IconX />,
            position: 'bottom-right',
          })
          setTransactions([])
        }
      },
      error: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        notifications.show({
          title: props.dictionary.transactionsPage.parsingErrorTitle,
          message: props.dictionary.transactionsPage.parsingErrorMessage,
          color: 'red',
          icon: <IconX />,
          position: 'bottom-right',
        })
      },
    })
  }

  return (
    <Box style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', alignItems: 'center' }}>
      <Tooltip label={props.dictionary.transactionsPage.exportTooltip}>
        <ActionIcon variant="filled" aria-label="export data button" onClick={downloadCSV}>
          <IconFileDownloadFilled />
        </ActionIcon>
      </Tooltip>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={uploadCSV} style={{ display: 'none' }} />
      <Tooltip label={props.dictionary.transactionsPage.importTooltip}>
        <ActionIcon variant="filled" aria-label="import data button" onClick={handleFileSelect}>
          <IconFileUploadFilled />
        </ActionIcon>
      </Tooltip>
      {openedImportModal && (
        <ImportModal
          dictionary={props.dictionary}
          opened={openedImportModal}
          close={() => {
            setTransactions([])
            importModalControls.close()
          }}
          transactions={transactions}
        />
      )}
      <CopyButton value={JSON.stringify(props.categories)}>
        {({ copied, copy }) => (
          <Tooltip label={props.dictionary.transactionsPage.exportCategoriesTooltip}>
            <ActionIcon variant="filled" aria-label="export categories" onClick={copy}>
              {copied ? <IconCopyCheckFilled /> : <IconCategoryMinus />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
      <Tooltip label={props.dictionary.transactionsPage.importCategoriesTooltip}>
        <ActionIcon variant="filled" aria-label="import categories" onClick={categoryModalControls.open}>
          <IconCategoryPlus />
        </ActionIcon>
      </Tooltip>
      {openedCategoryModal && (
        <CategoryImportModal
          dictionary={props.dictionary}
          opened={openedCategoryModal}
          close={() => {
            setTransactions([])
            categoryModalControls.close()
          }}
        />
      )}
    </Box>
  )
}
