import { Button, Menu, Group, ActionIcon, rem, useMantineTheme } from '@mantine/core'
import { IconCalendarDollar, IconCalendarMonth, IconChevronDown } from '@tabler/icons-react'
import classes from './AddTransactionButton.module.css'
import { Dictionary } from '@/utils/types'

interface AddTransactionButtonProps {
  dictionary: Dictionary
}

export function AddTransactionButton(props: AddTransactionButtonProps) {
  const theme = useMantineTheme()

  return (
    <Group wrap="nowrap" gap={0} style={{ marginTop: 'auto' }}>
      <Button className={classes.button}>{props.dictionary.budgetPage.addSingleTransaction}</Button>
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
          >
            {props.dictionary.budgetPage.addAnnualTransaction}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
