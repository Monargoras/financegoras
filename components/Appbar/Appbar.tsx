'use client'

import { ActionIcon, AppShell, Burger, Group, rem, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import { IconSunMoon } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logo from '../../public/financegoras.png'
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
  const router = useRouter()

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
            <Image
              src={logo}
              priority
              alt="Financegoras"
              width={48}
              height={48}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            />
            <Group ml="auto" gap={0} visibleFrom="sm">
              <UnstyledButton onClick={() => router.push('/')} className={classes.control}>
                {props.dictionary.appbar.home}
              </UnstyledButton>
              <UnstyledButton onClick={() => router.push('/budget')} className={classes.control}>
                {props.dictionary.appbar.budget}
              </UnstyledButton>
              <UnstyledButton onClick={() => router.push('/transactions')} className={classes.control}>
                {props.dictionary.appbar.transactions}
              </UnstyledButton>
              <UnstyledButton className={classes.control}>{props.dictionary.appbar.portfolio}</UnstyledButton>
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
        <UnstyledButton
          onClick={() => {
            router.push('/')
            toggle()
          }}
          className={classes.control}
        >
          {props.dictionary.appbar.home}
        </UnstyledButton>
        <UnstyledButton
          onClick={() => {
            router.push('/budget')
            toggle()
          }}
          className={classes.control}
        >
          {props.dictionary.appbar.budget}
        </UnstyledButton>
        <UnstyledButton
          onClick={() => {
            router.push('/transactions')
            toggle()
          }}
          className={classes.control}
        >
          {props.dictionary.appbar.transactions}
        </UnstyledButton>
        <UnstyledButton className={classes.control}>{props.dictionary.appbar.portfolio}</UnstyledButton>
        <Group style={{ marginTop: 24 }}>
          <AuthMenu dictionary={props.dictionary} unstyled />
        </Group>
      </AppShell.Navbar>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>{children}</AppShell.Main>
    </AppShell>
  )
}
