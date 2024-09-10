'use client'

import {
  ActionIcon,
  Anchor,
  AppShell,
  Burger,
  Group,
  rem,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import { IconSunMoon } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
            <Anchor
              href="/"
              onClick={(event) => {
                event.preventDefault()
                router.push('/')
              }}
              style={{ display: 'flex', lignItems: 'center' }}
            >
              <Image src={logo} priority alt="Financegoras" width={48} height={48} />
            </Anchor>
            <Group ml="auto" gap={0} visibleFrom="sm">
              <Anchor
                href="/"
                className={classes.control}
                onClick={(event) => {
                  event.preventDefault()
                  router.push('/')
                }}
              >
                {props.dictionary.appbar.home}
              </Anchor>
              <Anchor
                href="/budget"
                className={classes.control}
                onClick={(event) => {
                  event.preventDefault()
                  router.push('/budget')
                }}
              >
                {props.dictionary.appbar.budget}
              </Anchor>
              <Anchor
                href="/transactions"
                className={classes.control}
                onClick={(event) => {
                  event.preventDefault()
                  router.push('/transactions')
                }}
              >
                {props.dictionary.appbar.transactions}
              </Anchor>
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
