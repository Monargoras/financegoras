import { useState } from 'react'
import { Button, Menu, Group, ActionIcon, rem, useMantineTheme, Select, Modal, Flex } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCalendarDollar, IconCalendarMonth, IconChevronDown, IconCalendar } from '@tabler/icons-react'
import { DateTimePicker } from '@mantine/dates'
import classes from './AddTransactionButton.module.css'
import { Dictionary, TransactionType } from '@/utils/types'

interface AddTransactionButtonProps {
  dictionary: Dictionary
  handleAddTransaction: (transactionType: TransactionType, inputDate?: Date) => Promise<boolean>
}

export function AddTransactionButton(props: AddTransactionButtonProps) {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [date, setDate] = useState<Date | null>(null)
  const [type, setType] = useState<string | null>(TransactionType[0])
  const [dateError, setDateError] = useState(false)

  return (
    <Group wrap="nowrap" gap={0} style={{ marginTop: 'auto' }}>
      <Button className={classes.button} onClick={() => props.handleAddTransaction(TransactionType.Single)}>
        {props.dictionary.budgetPage.addSingleTransaction}
      </Button>
      <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="filled" color={theme.primaryColor} size={36} className={classes.menuControl}>
            <IconChevronDown style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconCalendarMonth
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.primary[5]}
              />
            }
            onClick={() => props.handleAddTransaction(TransactionType.Monthly)}
          >
            {props.dictionary.budgetPage.addMonthlyTransaction}
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconCalendarDollar
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.primary[5]}
              />
            }
            onClick={() => props.handleAddTransaction(TransactionType.Annual)}
          >
            {props.dictionary.budgetPage.addAnnualTransaction}
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconCalendar style={{ width: rem(16), height: rem(16) }} stroke={1.5} color={theme.colors.primary[5]} />
            }
            onClick={open}
          >
            {props.dictionary.budgetPage.addDateTransaction}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal opened={opened} onClose={close} title={props.dictionary.budgetPage.addDateTransaction} centered>
        <DateTimePicker
          dropdownType="modal"
          value={date}
          onChange={setDate}
          error={dateError}
          placeholder={props.dictionary.budgetPage.pickDate}
          label={props.dictionary.budgetPage.date}
          valueFormat="DD MMMM YYYY HH:mm"
          required
          style={{ marginTop: 20 }}
        />
        <Select
          value={type}
          onChange={setType}
          data={[
            { label: props.dictionary.budgetPage.single, value: TransactionType[0] },
            { label: props.dictionary.budgetPage.monthly, value: TransactionType[1] },
            { label: props.dictionary.budgetPage.annual, value: TransactionType[2] },
          ]}
          placeholder={props.dictionary.budgetPage.pickType}
          label={props.dictionary.budgetPage.type}
        />
        <Flex justify="flex-end">
          <Button
            onClick={async () => {
              if (!date) {
                setDateError(true)
                return
              }
              close()
              const succcess = await props.handleAddTransaction(
                TransactionType[type as keyof typeof TransactionType],
                date
              )
              if (succcess) {
                setDate(null)
                setType(TransactionType[0])
              }
            }}
            style={{ marginTop: 20 }}
          >
            {props.dictionary.budgetPage.add}
          </Button>
          <Button onClick={close} style={{ marginTop: 20, marginLeft: 10 }} color="gray" variant="outline">
            {props.dictionary.budgetPage.cancel}
          </Button>
        </Flex>
      </Modal>
    </Group>
  )
}
