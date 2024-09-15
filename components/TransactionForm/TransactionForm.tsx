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
  Switch,
} from '@mantine/core'
import useSWR, { Fetcher, useSWRConfig } from 'swr'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { IconPlus, IconMinus, IconCheck, IconX } from 'tabler-icons'
import { Categories, Dictionary, TransactionType } from '@/utils/types'
import { AddTransactionButton } from './AddTransactionButton'
import CategoryDrawer from '@/components/CategoryDrawer/CategoryDrawer'
import submitTransaction from '@/serverActions/submitTransaction'
import updateCategories from '@/serverActions/updateCategories'

interface TransactionFormProps {
  dictionary: Dictionary
  initialData: Categories | null
}

export const IsIncomeIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus {...others} /> : <IconPlus {...others} />

export const checkboxTheme = createTheme({
  cursorType: 'pointer',
})

export default function TransactionForm(props: TransactionFormProps) {
  const { mutate } = useSWRConfig()
  const [isIncome, setIsIncome] = useState(false)
  const [isSavings, setIsSavings] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<string | number>(0)
  const [categories, setCategories] = useState<Categories | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [amountError, setAmountError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [categoryError, setCategoryError] = useState(false)
  const [updateBackendCategories, setUpdateBackendCategories] = useState(false)

  const fetcher: Fetcher<Categories, string> = (input: RequestInfo | URL) => fetch(input).then((res) => res.json())
  const { data } = useSWR('/api/budget/getCategories', fetcher, {
    fallbackData: props.initialData ?? [],
  })

  useEffect(() => {
    if (data) {
      setCategories(data)
      setCategory(data[0].items[0])
    }
  }, [data])

  useEffect(() => {
    if (categories) {
      setCategory(categories[0].items[0])
    }
  }, [categories])

  useEffect(() => {
    if (!updateBackendCategories || !categories) {
      return
    }
    updateCategories(categories).then((success) => {
      if (success) {
        notifications.show({
          title: props.dictionary.budgetPage.feedbackUpdateBackendSuccessTitle,
          message: props.dictionary.budgetPage.feedbackUpdateBackendSuccessMessage,
          color: 'green',
          icon: <IconCheck />,
          position: 'bottom-right',
        })
        // refresh all transaction related data after updating categories
        mutate(
          (key) => typeof key === 'string' && key.startsWith('/api/budget/') && key !== '/api/budget/getCategories'
        )
        mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions/'))
      } else {
        notifications.show({
          title: props.dictionary.budgetPage.feedbackUpdateBackendErrorTitle,
          message: props.dictionary.budgetPage.feedbackUpdateBackendErrorMessage,
          color: 'red',
          icon: <IconX />,
          position: 'bottom-right',
        })
      }
      setUpdateBackendCategories(false)
    })
  }, [updateBackendCategories])

  const validData = () => {
    let isValid = true
    if (name.length === 0) {
      setNameError(true)
      isValid = false
    }
    if (!amount || amount === 0) {
      setAmountError(true)
      isValid = false
    }
    if (!category || category === props.dictionary.budgetPage.noCategory) {
      setCategoryError(true)
      isValid = false
    }
    return isValid
  }

  const handleAddTransaction = async (transactionType: TransactionType, date?: Date) => {
    if (!validData()) {
      return false
    }

    const success = await submitTransaction(
      isIncome,
      isSavings,
      Number(amount),
      name,
      category ?? '',
      transactionType,
      date
    )
    if (success) {
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
    <Container fluid>
      <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
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
          data={
            categories ?? [
              { group: props.dictionary.budgetPage.noGroup, items: [props.dictionary.budgetPage.noCategory] },
            ]
          }
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
          value={category ?? props.dictionary.budgetPage.noCategory}
          onChange={(value) => {
            setCategory(value)
            setCategoryError(false)
          }}
          error={categoryError}
          maxDropdownHeight={400}
          allowDeselect={false}
        />
        <AddTransactionButton dictionary={props.dictionary} handleAddTransaction={handleAddTransaction} />
      </Flex>
    </Container>
  )
}
