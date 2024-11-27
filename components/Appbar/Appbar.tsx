'use client'

import { ActionIcon, AppShell, Burger, Divider, Group, rem, Tooltip, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import { IconEye, IconEyeOff, IconSunMoon } from '@tabler/icons-react'
import { useContext } from 'react'
import Image from 'next/image'
import logo from '@/public/img/financegoras.png'
import classes from './Appbar.module.css'
import { Dictionary } from '@/utils/types'
import AuthMenu from './AuthMenu'
import LocaleSwitcher from './LocaleSwitcher'
import { PrivacyModeContext } from '@/components/ClientProviders/ClientProviders'

interface AppbarProps {
  dictionary: Dictionary
}

export function Appbar({ children, props }: { children: React.ReactNode; props: AppbarProps }) {
  const [opened, { toggle }] = useDisclosure()
  const { toggleColorScheme } = useMantineColorScheme()
  const pinned = useHeadroom({ fixedAt: 120 })
  const { privacyMode, togglePrivacyMode } = useContext(PrivacyModeContext)

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
              <Link href="/analysis" className={classes.control}>
                {props.dictionary.appbar.analysis}
              </Link>
              <Divider size="sm" mx="sm" variant="solid" orientation="vertical" />
            </Group>
            <Group>
              <Tooltip label={props.dictionary.appbar.tooltipPrivacy} position="bottom">
                <ActionIcon variant="subtle" aria-label="absolute numbers privacy toggle" color="gray">
                  {privacyMode ? <IconEyeOff onClick={togglePrivacyMode} /> : <IconEye onClick={togglePrivacyMode} />}
                </ActionIcon>
              </Tooltip>
              <LocaleSwitcher dictionary={props.dictionary} />
              <Tooltip label={props.dictionary.appbar.tooltipToggleTheme} position="bottom">
                <ActionIcon variant="subtle" aria-label="light/dark mode toggle" color="gray">
                  <IconSunMoon onClick={toggleColorScheme} />
                </ActionIcon>
              </Tooltip>
              <AuthMenu dictionary={props.dictionary} />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Link
          href="/"
          className={classes.control}
          onClick={() => {
            toggle()
          }}
        >
          {props.dictionary.appbar.home}
        </Link>
        <Link
          href="/budget"
          className={classes.control}
          onClick={() => {
            toggle()
          }}
        >
          {props.dictionary.appbar.budget}
        </Link>
        <Link
          href="/transactions"
          className={classes.control}
          onClick={() => {
            toggle()
          }}
        >
          {props.dictionary.appbar.transactions}
        </Link>
        <Link
          href="/analysis"
          className={classes.control}
          onClick={() => {
            toggle()
          }}
        >
          {props.dictionary.appbar.analysis}
        </Link>
      </AppShell.Navbar>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>{children}</AppShell.Main>
    </AppShell>
  )
}
