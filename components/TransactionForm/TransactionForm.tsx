'use client'

import {
  Checkbox,
  CheckboxProps,
  Container,
  createTheme,
  Flex,
  MantineProvider,
  Select,
  NumberInput,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { mutate } from 'swr'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { IconPlus, IconMinus, IconCheck, IconX } from 'tabler-icons'
import { Dictionary, TransactionType } from '@/utils/types'
import { AddTransactionButton } from './AddTransactionButton'
import CategoryDrawer from '../CategoryDrawer/CategoryDrawer'

interface TransactionFormProps {
  dictionary: Dictionary
}

const IsIncomeIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus {...others} /> : <IconPlus {...others} />

const categories = [
  {
    group: 'Freetime',
    items: ['Restaurants', 'Activities', 'Socializing', 'Gifts', 'Vacation'],
  },
  {
    group: 'Recurring',
    items: ['Rent', 'Groceries', 'Upkeep', 'Subscriptions'],
  },
  {
    group: 'Investments',
    items: ['Single Stocks', 'ETFs', 'Property'],
  },
  {
    group: 'Income',
    items: ['Salary', 'Sidejob', 'Infrequent'],
  },
]

const checkboxTheme = createTheme({
  cursorType: 'pointer',
})

export default function TransactionForm(props: TransactionFormProps) {
  const [isIncome, setIsIncome] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<string | number>(0)
  const [category, setCategory] = useState<string | null>(categories[0].items[0])
  const [amountError, setAmountError] = useState(false)
  const [nameError, setNameError] = useState(false)

  const handleAddTransaction = async (transactionType: TransactionType, date?: Date) => {
    if (name.length === 0) {
      setNameError(true)
      return false
    }
    if (amount === 0) {
      setAmountError(true)
      return false
    }

    const res = await fetch('/api/budget/addTransaction', {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({ isIncome, amount, name, category, transactionType, date }),
    })
    if (res.status === 200) {
      setName('')
      setAmount('')
      setCategory(categories[0].items[0])
      setIsIncome(false)
      notifications.show({
        title: props.dictionary.budgetPage.feedbackAddTransactionSuccessTitle,
        message: props.dictionary.budgetPage.feedbackAddTransactionSuccessMessage,
        color: 'green',
        icon: <IconCheck />,
        position: 'bottom-right',
      })
      mutate((key) => typeof key === 'string' && key.startsWith('/api/budget/'))
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
    <Container fluid>
      <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
        <MantineProvider theme={checkboxTheme}>
          <Tooltip label={props.dictionary.budgetPage.income}>
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
        <TextInput
          value={name}
          error={nameError}
          label={props.dictionary.budgetPage.name}
          onChange={(event) => {
            setNameError(false)
            setName(event.currentTarget.value)
          }}
        />
        <Select
          data={categories}
          label={
            <Flex direction="row" gap="xs">
              {props.dictionary.budgetPage.category}
              <CategoryDrawer dictionary={props.dictionary} />
            </Flex>
          }
          value={category}
          onChange={(value) => setCategory(value)}
          maxDropdownHeight={400}
          allowDeselect={false}
        />
        <AddTransactionButton dictionary={props.dictionary} handleAddTransaction={handleAddTransaction} />
      </Flex>
    </Container>
  )
}
