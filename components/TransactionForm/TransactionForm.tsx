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
import useSWR, { mutate } from 'swr'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { IconPlus, IconMinus, IconCheck, IconX } from 'tabler-icons'
import { Categories, Dictionary, TransactionType } from '@/utils/types'
import { AddTransactionButton } from './AddTransactionButton'
import CategoryDrawer from '../CategoryDrawer/CategoryDrawer'

interface TransactionFormProps {
  dictionary: Dictionary
}

const IsIncomeIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus {...others} /> : <IconPlus {...others} />

const checkboxTheme = createTheme({
  cursorType: 'pointer',
})

export default function TransactionForm(props: TransactionFormProps) {
  const [isIncome, setIsIncome] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<string | number>(0)
  const [categories, setCategories] = useState<Categories | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [amountError, setAmountError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [updateBackendCategories, setUpdateBackendCategories] = useState(false)

  const fetcher = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data } = useSWR('/api/budget/getCategories', fetcher)

  useEffect(() => {
    if (data) {
      setCategories(data.categories)
      setCategory(data.categories[0].items[0])
    }
  }, [data])

  useEffect(() => {
    if (!updateBackendCategories) {
      return
    }
    fetch('/api/budget/updateCategories', {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify(categories),
    }).then((res) => {
      if (res.status === 200) {
        notifications.show({
          title: props.dictionary.budgetPage.feedbackUpdateBackendSuccessTitle,
          message: props.dictionary.budgetPage.feedbackUpdateBackendSuccessMessage,
          color: 'green',
          icon: <IconCheck />,
          position: 'bottom-right',
        })
      } else {
        notifications.show({
          title: props.dictionary.budgetPage.feedbackUpdateBackendErrorTitle,
          message: props.dictionary.budgetPage.feedbackUpdateBackendErrorMessage,
          color: 'red',
          icon: <IconX />,
          position: 'bottom-right',
        })
      }
    })
    setUpdateBackendCategories(false)
  }, [updateBackendCategories])

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
      if (categories) {
        setCategory(categories[0].items[0])
      }
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
          data={categories ?? []}
          label={
            <Flex direction="row" gap="xs">
              {props.dictionary.budgetPage.category}
              <CategoryDrawer
                dictionary={props.dictionary}
                categories={categories ?? []}
                setCategories={setCategories}
                setUpdateBackendCategories={setUpdateBackendCategories}
              />
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
