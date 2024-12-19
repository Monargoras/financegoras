'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  MantineProvider,
  Modal,
  NumberInput,
  rem,
  Select,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { DateTimePicker, MonthPickerInput, YearPickerInput } from '@mantine/dates'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useSWRConfig } from 'swr'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconDeviceFloppy, IconX, IconTrashX, IconChevronRight, IconChevronDown } from '@tabler/icons-react'
import { Categories, Dictionary, Transaction, TransactionType } from '@/utils/types'
import { checkboxTheme, IsIncomeIcon } from '../TransactionForm/TransactionForm'
import updateTransaction from '@/serverActions/updateTransaction'
import deleteTransaction from '@/serverActions/deleteTransaction'

interface TransactionEditModalProps {
  dictionary: Dictionary
  opened: boolean
  close: () => void
  transaction: Transaction
  categories: Categories
}

export default function TransactionEditModal(props: TransactionEditModalProps) {
  const { mutate } = useSWRConfig()
  const isMobile = useMediaQuery('(max-width: 50em)')
  const [opened, { toggle }] = useDisclosure(false)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: props.transaction.name,
      amount: props.transaction.amount,
      category: props.transaction.category,
      transactionType: TransactionType[props.transaction.transactionType],
      createdAt: new Date(props.transaction.createdAt),
      stoppedAt: props.transaction.stoppedAt ? new Date(props.transaction.stoppedAt) : null,
      isIncome: props.transaction.isIncome,
      isSavings: props.transaction.isSavings,
    },
    validate: {
      // functions return true if there is an error
      name: (value) => value.length === 0 || value.length > 50,
      amount: (value) => value <= 0,
      createdAt: (value) => value === null,
      stoppedAt: (value, formValues) =>
        formValues.transactionType === TransactionType[TransactionType.Single] && formValues.createdAt && value
          ? formValues.createdAt.getTime() !== value.getTime()
          : null,
    },
  })

  useEffect(() => {
    if (form.values.transactionType === TransactionType[TransactionType.Single]) {
      form.setFieldValue('stoppedAt', null)
      if (opened) {
        toggle()
      }
    }
  }, [form.values.transactionType])

  const handleUpdateTransaction = async () => {
    const res = form.validate()
    if (res.hasErrors) {
      return false
    }
    // set stopped date to 12 noon to avoid timezone issues if it was never set before
    if (form.values.stoppedAt && !props.transaction.stoppedAt) {
      form.setFieldValue('stoppedAt', new Date(form.values.stoppedAt.setHours(12, 0, 0, 0)))
    }
    const { name, amount, category, transactionType, createdAt, stoppedAt, isIncome, isSavings } = form.values

    const success = await updateTransaction(
      props.transaction.id,
      isIncome,
      isSavings,
      Number(amount),
      name,
      category ?? '',
      transactionType,
      createdAt.toUTCString(),
      transactionType === TransactionType[TransactionType.Single]
        ? createdAt.toUTCString()
        : stoppedAt
          ? stoppedAt.toUTCString()
          : null
    )
    if (success) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackUpdateTransactionSuccessTitle,
        message: props.dictionary.budgetPage.feedbackUpdateTransactionSuccessMessage,
        color: 'green',
        icon: <IconCheck />,
        position: 'bottom-right',
      })
      mutate((key) => typeof key === 'string' && key.startsWith('/api/budget/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/analysis/'))
      return true
    }
    notifications.show({
      title: props.dictionary.budgetPage.feedbackUpdateTransactionErrorTitle,
      message: props.dictionary.budgetPage.feedbackUpdateTransactionErrorMessage,
      color: 'red',
      icon: <IconX />,
      position: 'bottom-right',
    })
    return false
  }

  const handleDeleteTransaction = async () => {
    const success = await deleteTransaction(props.transaction.id)
    if (success) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackDeleteTransactionSuccessTitle,
        message: props.dictionary.budgetPage.feedbackDeleteTransactionSuccessMessage,
        color: 'green',
        icon: <IconCheck />,
        position: 'bottom-right',
      })
      mutate((key) => typeof key === 'string' && key.startsWith('/api/budget/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/analysis/'))
      return true
    }
    notifications.show({
      title: props.dictionary.budgetPage.feedbackDeleteTransactionErrorTitle,
      message: props.dictionary.budgetPage.feedbackDeleteTransactionErrorMessage,
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
                style={{ marginTop: 'auto' }}
                size="xl"
                indeterminate={!form.getValues().isIncome}
                icon={IsIncomeIcon}
                labelPosition="left"
                key={form.key('isIncome')}
                {...form.getInputProps('isIncome', { type: 'checkbox' })}
              />
            </Tooltip>
          </MantineProvider>
          <NumberInput
            label={props.dictionary.budgetPage.amount}
            allowNegative={false}
            prefix="€"
            decimalScale={2}
            thousandSeparator=" "
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            key={form.key('amount')}
            error={form.errors.amount}
            {...form.getInputProps('amount', { type: 'input' })}
            maxLength={15}
          />
          <Switch
            onLabel={props.dictionary.budgetPage.isSavings}
            offLabel={props.dictionary.budgetPage.isIncomeExpense}
            size="xl"
            style={{ marginTop: 'auto' }}
            key={form.key('isSavings')}
            {...form.getInputProps('isSavings', { type: 'checkbox' })}
          />
        </Flex>
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <TextInput
            label={props.dictionary.budgetPage.name}
            key={form.key('name')}
            error={form.errors.name}
            maxLength={50}
            {...form.getInputProps('name', { type: 'input' })}
          />
          <Select
            data={props.categories.map((c) => ({ group: c.group, items: c.items.map((i) => i.name) }))}
            label={props.dictionary.budgetPage.category}
            maxDropdownHeight={400}
            allowDeselect={false}
            key={form.key('category')}
            {...form.getInputProps('category', { type: 'input' })}
          />
          <Select
            data={Object.keys(TransactionType)
              .filter((key) => Number.isNaN(Number(key)))
              .map((key) => ({ value: key, label: props.dictionary.budgetPage[key.toLowerCase()] }))}
            label={props.dictionary.budgetPage.type}
            maxDropdownHeight={400}
            allowDeselect={false}
            key={form.key('transactionType')}
            {...form.getInputProps('transactionType', { type: 'input' })}
          />
        </Flex>
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <DateTimePicker
            dropdownType="modal"
            label={props.dictionary.budgetPage.createdAt}
            valueFormat="DD MMMM YYYY HH:mm"
            miw={rem(200)}
            key={form.key('createdAt')}
            error={form.errors.createdAt}
            {...form.getInputProps('createdAt', { type: 'input' })}
          />
          <DateTimePicker
            dropdownType="modal"
            label={props.dictionary.budgetPage.stoppedAt}
            disabled={form.getValues().transactionType === TransactionType[TransactionType.Single]}
            valueFormat="DD MMMM YYYY HH:mm"
            miw={rem(200)}
            key={form.key('stoppedAt')}
            error={form.errors.stoppedAt}
            {...form.getInputProps('stoppedAt', { type: 'input' })}
          />
        </Flex>
      </Flex>
      <Divider
        onClick={() => {
          if (form.values.transactionType !== TransactionType[TransactionType.Single]) {
            toggle()
          }
        }}
        my="md"
        size="md"
        label={
          <Flex direction="row">
            {opened && <IconChevronDown />}
            {!opened && <IconChevronRight />}
            <Text>Advanced options recurring</Text>
          </Flex>
        }
        labelPosition="left"
        style={{
          display: form.values.transactionType !== TransactionType[TransactionType.Single] ? 'block' : 'none',
          cursor: form.values.transactionType !== TransactionType[TransactionType.Single] ? 'pointer' : 'not-allowed',
        }}
      />
      <Collapse in={opened} mb="xl">
        <Flex justify="center" align="center" gap="md" direction="column">
          <Button leftSection={<IconDeviceFloppy style={{ width: rem(14), height: rem(14) }} />} onClick={() => {}}>
            Pause one month
          </Button>
          <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
            {form.values.transactionType === TransactionType[TransactionType.Annual] && (
              <YearPickerInput
                type="range"
                placeholder="Pause from to"
                value={dateRange}
                onChange={setDateRange}
                clearable
              />
            )}
            {form.values.transactionType === TransactionType[TransactionType.Monthly] && (
              <MonthPickerInput
                type="range"
                placeholder="Pause from to"
                value={dateRange}
                onChange={setDateRange}
                clearable
              />
            )}
            <Button leftSection={<IconDeviceFloppy style={{ width: rem(14), height: rem(14) }} />} onClick={() => {}}>
              Pause for range
            </Button>
          </Flex>
          <Button leftSection={<IconDeviceFloppy style={{ width: rem(14), height: rem(14) }} />} onClick={() => {}}>
            Stop this transaction today
          </Button>
          <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
            <NumberInput
              allowNegative={false}
              prefix="€"
              decimalScale={2}
              thousandSeparator=" "
              stepHoldDelay={500}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
              key={form.key('amount')}
              error={form.errors.amount}
              {...form.getInputProps('amount', { type: 'input' })}
              maxLength={15}
            />
            <Button leftSection={<IconDeviceFloppy style={{ width: rem(14), height: rem(14) }} />} onClick={() => {}}>
              Update just this months payment
            </Button>
            <Button leftSection={<IconDeviceFloppy style={{ width: rem(14), height: rem(14) }} />} onClick={() => {}}>
              Update price starting this month
            </Button>
          </Flex>
        </Flex>
      </Collapse>
      <Divider size="md" style={{ marginTop: 16 }} />
      <Flex justify="center" align="center" gap="md" style={{ marginTop: 16 }}>
        <Button
          color="red"
          leftSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
          onClick={async () => {
            const success = await handleDeleteTransaction()
            if (success) {
              props.close()
            }
          }}
        >
          {props.dictionary.budgetPage.delete}
        </Button>
        <Button
          leftSection={<IconDeviceFloppy style={{ width: rem(14), height: rem(14) }} />}
          onClick={async () => {
            const success = await handleUpdateTransaction()
            if (success) {
              props.close()
            }
          }}
          style={{ marginLeft: 'auto' }}
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
