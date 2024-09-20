'use client'

import { ActionIcon, AppShell, Burger, Group, rem, Tooltip, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import { IconSunMoon } from '@tabler/icons-react'
import Image from 'next/image'
import logo from '@/public/img/financegoras.png'
import classes from './Appbar.module.css'
import { Dictionary } from '@/utils/types'
import AuthMenu from './AuthMenu'
import LocaleSwitcher from './LocaleSwitcher'

interface AppbarProps {
  dictionary: Dictionary
}

export function Appbar({ children, props }: { children: React.ReactNode; props: AppbarProps }) {
  const [opened, { toggle }] = useDisclosure()
  const { toggleColorScheme } = useMantineColorScheme()
  const pinned = useHeadroom({ fixedAt: 120 })

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" align="center" style={{ flex: 1 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={logo} priority alt="Financegoras" width={48} height={48} />
            </Link>
            <Group ml="auto" gap={0} visibleFrom="sm">
              <Link href="/" className={classes.control}>
                {props.dictionary.appbar.home}
              </Link>
              <Link href="/budget" className={classes.control}>
                {props.dictionary.appbar.budget}
              </Link>
              <Link href="/transactions" className={classes.control}>
                {props.dictionary.appbar.transactions}
              </Link>
              <Tooltip label={props.dictionary.appbar.comingSoon} position="bottom" withArrow>
                <UnstyledButton className={classes.disabledControl}>{props.dictionary.appbar.portfolio}</UnstyledButton>
              </Tooltip>
              <AuthMenu dictionary={props.dictionary} />
            </Group>
            <Group>
              <LocaleSwitcher dictionary={props.dictionary} />
              <ActionIcon variant="subtle" aria-label="light/dark mode toggle" color="gray">
                <IconSunMoon onClick={toggleColorScheme} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Link href="/" className={classes.control}>
          {props.dictionary.appbar.home}
        </Link>
        <Link href="/budget" className={classes.control}>
          {props.dictionary.appbar.budget}
        </Link>
        <Link href="/transactions" className={classes.control}>
          {props.dictionary.appbar.transactions}
        </Link>
        <Tooltip label={props.dictionary.appbar.comingSoon} position="bottom-start">
          <UnstyledButton className={classes.disabledControl}>{props.dictionary.appbar.portfolio}</UnstyledButton>
        </Tooltip>
        <Group style={{ marginTop: 24 }}>
          <AuthMenu dictionary={props.dictionary} unstyled />
        </Group>
      </AppShell.Navbar>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>{children}</AppShell.Main>
    </AppShell>
  )
}
