'use client'

import { Checkbox, CheckboxProps, Container, Flex, NativeSelect, NumberInput, TextInput } from '@mantine/core'
import { useState } from 'react'
import { IconPlus, IconMinus } from 'tabler-icons'
import { Dictionary, TransactionType } from '@/utils/types'
import { AddTransactionButton } from './AddTransactionButton'

interface TransactionFormProps {
  language: string
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
    items: ['Salary', 'Sidejob', 'Rent', 'Infrequent'],
  },
]

export default function TransactionForm(props: TransactionFormProps) {
  const [isIncome, setIsIncome] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<string | number>('')
  const [category, setCategory] = useState(categories[0].items[0])

  const handleAddTransaction = async (transactionType: TransactionType) => {
    const res = await fetch('/api/addTransaction', {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({ isIncome, amount, name, category, transactionType }),
    })
    // TODO add feedback to the user https://mantine.dev/core/notification/
    if (res.status === 200) {
      setName('')
      setAmount('')
      setCategory(categories[0].items[0])
      setIsIncome(false)
      return true
    }
    return false
  }

  return (
    <Container fluid>
      <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
        <Checkbox
          checked={isIncome}
          style={{ marginTop: 'auto' }}
          size="xl"
          indeterminate={!isIncome}
          icon={IsIncomeIcon}
          label={props.dictionary.budgetPage.income}
          labelPosition="left"
          onChange={(event) => setIsIncome(event.currentTarget.checked)}
        />
        <NumberInput
          value={amount}
          label={props.dictionary.budgetPage.amount}
          onChange={setAmount}
          allowNegative={false}
          prefix="€"
          decimalScale={2}
          thousandSeparator=" "
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
        <TextInput
          value={name}
          label={props.dictionary.budgetPage.name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <NativeSelect
          style={{ marginTop: 'auto' }}
          value={category}
          onChange={(event) => setCategory(event.currentTarget.value)}
          data={categories}
        />
        <AddTransactionButton dictionary={props.dictionary} handleAddTransaction={handleAddTransaction} />
      </Flex>
    </Container>
  )
}
