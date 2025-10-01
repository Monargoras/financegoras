'use client'

import { ActionIcon, Tooltip } from '@mantine/core'
import { IconFileDownloadFilled } from '@tabler/icons-react'
import { Dictionary, EXPORT_ORDER, Transaction, TransactionType } from '@/utils/types'

interface ExportImportDataProps {
  dictionary: Dictionary
  transactions: Transaction[]
}

export default function ExportImportData(props: ExportImportDataProps) {
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

  return (
    <Tooltip label={props.dictionary.transactionsPage.exportTooltip}>
      <ActionIcon variant="filled" aria-label="export data button" onClick={downloadCSV}>
        <IconFileDownloadFilled />
      </ActionIcon>
    </Tooltip>
  )
}
