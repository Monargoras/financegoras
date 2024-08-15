import { Button, Menu, Group, ActionIcon, rem, useMantineTheme } from '@mantine/core'
import { IconCalendarDollar, IconCalendarMonth, IconChevronDown } from '@tabler/icons-react'
import classes from './AddTransactionButton.module.css'
import { Dictionary, TransactionType } from '@/utils/types'

interface AddTransactionButtonProps {
  dictionary: Dictionary
  handleAddTransaction: (transactionType: TransactionType) => Promise<boolean>
}

export function AddTransactionButton(props: AddTransactionButtonProps) {
  const theme = useMantineTheme()

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
                color={theme.colors.blue[5]}
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
                color={theme.colors.blue[5]}
              />
            }
            onClick={() => props.handleAddTransaction(TransactionType.Annual)}
          >
            {props.dictionary.budgetPage.addAnnualTransaction}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
