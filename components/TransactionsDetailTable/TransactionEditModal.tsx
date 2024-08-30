'use client'

import { useState } from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  MantineProvider,
  Modal,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import { mutate } from 'swr'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from 'tabler-icons'
import { Categories, Dictionary, Transaction, TransactionType } from '@/utils/types'
import { checkboxTheme, IsIncomeIcon } from '../TransactionForm/TransactionForm'
import updateTransaction from '@/serverActions/updateTransaction'

interface TransactionEditModalProps {
  dictionary: Dictionary
  opened: boolean
  close: () => void
  transaction: Transaction
  categories: Categories
}

export default function TransactionEditModal(props: TransactionEditModalProps) {
  const isMobile = useMediaQuery('(max-width: 50em)')

  const [name, setName] = useState(props.transaction.name)
  const [amount, setAmount] = useState<string | number>(props.transaction.amount)
  const [category, setCategory] = useState(props.transaction.category)
  const [transactionType, setTransactionType] = useState(TransactionType[props.transaction.transactionType])
  const [createdAt, setCreatedAt] = useState<Date | null>(new Date(props.transaction.createdAt))
  const [stoppedAt, setStoppedAt] = useState<Date | null>(
    props.transaction.stoppedAt ? new Date(props.transaction.stoppedAt) : null
  )
  const [isIncome, setIsIncome] = useState(props.transaction.isIncome)
  const [isSavings, setIsSavings] = useState(props.transaction.isSavings)
  const [amountError, setAmountError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [createdAtError, setCreatedAtError] = useState(false)
  const [stoppedAtError, setStoppedAtError] = useState(false)

  const handleUpdateTransaction = async () => {
    if (name.length === 0) {
      setNameError(true)
      return false
    }
    if (amount === 0) {
      setAmountError(true)
      return false
    }
    if (!createdAt) {
      setCreatedAtError(true)
      return false
    }
    if (
      transactionType === TransactionType[TransactionType.Single] &&
      (!stoppedAt || createdAt.getTime() !== stoppedAt.getTime())
    ) {
      setStoppedAtError(true)
      return false
    }

    const success = await updateTransaction(
      props.transaction.id,
      isIncome,
      isSavings,
      Number(amount),
      name,
      category ?? '',
      transactionType,
      createdAt,
      stoppedAt
    )
    if (success) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackAddTransactionSuccessTitle,
        message: props.dictionary.budgetPage.feedbackAddTransactionSuccessMessage,
        color: 'green',
        icon: <IconCheck />,
        position: 'bottom-right',
      })
      mutate((key) => typeof key === 'string' && key.startsWith('/api/budget/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions/'))
      return true
    }
    notifications.show({
      title: props.dictionary.budgetPage.feedbackAddTransactionErrorTitle,
      message: props.dictionary.budgetPage.feedbackAddTransactionErrorMessage,
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
      title={props.dictionary.transactionsPage.editTransaction}
      fullScreen={isMobile}
      size="xl"
    >
      <Flex justify="center" align="center" gap="md" direction="column" wrap="wrap">
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <MantineProvider theme={checkboxTheme}>
            <Tooltip label={props.dictionary.budgetPage.incomeTooltip}>
              <Checkbox
                checked={isIncome}
                style={{ marginTop: 'auto' }}
                size="xl"
                indeterminate={!isIncome}
                icon={IsIncomeIcon}
                labelPosition="left"
                onChange={(event) => setIsIncome(event.currentTarget.checked)}
              />
            </Tooltip>
          </MantineProvider>
          <NumberInput
            value={amount}
            label={props.dictionary.budgetPage.amount}
            onChange={(value) => {
              setAmountError(false)
              setAmount(value)
            }}
            error={amountError}
            allowNegative={false}
            prefix="€"
            decimalScale={2}
            thousandSeparator=" "
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          />
          <Switch
            checked={isSavings}
            onChange={(event) => setIsSavings(event.currentTarget.checked)}
            onLabel={props.dictionary.budgetPage.isSavings}
            offLabel={props.dictionary.budgetPage.isIncomeExpense}
            size="xl"
            style={{ marginTop: 'auto' }}
          />
        </Flex>
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <TextInput
            label={props.dictionary.budgetPage.name}
            value={name}
            error={nameError}
            onChange={(e) => {
              setName(e.currentTarget.value)
              setNameError(false)
            }}
          />
          <Select
            data={props.categories}
            label={props.dictionary.budgetPage.category}
            value={category}
            onChange={(value) => setCategory(value as string)}
            maxDropdownHeight={400}
            allowDeselect={false}
          />
          <Select
            data={Object.keys(TransactionType)
              .filter((key) => Number.isNaN(Number(key)))
              .map((key) => ({ value: key, label: props.dictionary.budgetPage[key.toLowerCase()] }))}
            label={props.dictionary.budgetPage.type}
            value={transactionType}
            onChange={(value) => {
              setTransactionType(value as string)
              if (value === TransactionType[TransactionType.Single]) {
                setStoppedAt(createdAt)
              }
            }}
            maxDropdownHeight={400}
            allowDeselect={false}
          />
        </Flex>
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <DateInput
            label={props.dictionary.budgetPage.createdAt}
            value={createdAt}
            error={createdAtError}
            onChange={(value) => {
              setCreatedAtError(false)
              setCreatedAt(value)
            }}
            allowDeselect={false}
            valueFormat="DD MMMM YYYY"
          />
          <DateInput
            label={props.dictionary.budgetPage.stoppedAt}
            value={stoppedAt}
            error={stoppedAtError}
            disabled={transactionType === TransactionType[TransactionType.Single]}
            onChange={(value) => {
              setStoppedAtError(false)
              setStoppedAt(value)
            }}
            allowDeselect={false}
            valueFormat="DD MMMM YYYY"
          />
        </Flex>
      </Flex>
      <Divider size="md" style={{ marginTop: 16 }} />
      <Flex justify="center" align="center" gap="md" style={{ marginTop: 16 }}>
        <Button
          onClick={async () => {
            const success = await handleUpdateTransaction()
            if (success) {
              props.close()
            }
          }}
        >
          {props.dictionary.budgetPage.save}
        </Button>
        <Button
          variant="light"
          onClick={() => {
            props.close()
          }}
        >
          {props.dictionary.budgetPage.cancel}
        </Button>
      </Flex>
    </Modal>
  )
}
