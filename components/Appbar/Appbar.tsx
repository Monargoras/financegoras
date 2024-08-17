'use client'

import { AppShell, Burger, Group, rem, UnstyledButton } from '@mantine/core'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logo from '../../public/financegoras.png'
import classes from './Appbar.module.css'
import { Dictionary } from '@/utils/types'
import AuthMenu from '../AuthMenu/AuthMenu'

interface AppbarProps {
  dictionary: Dictionary
}

export function Appbar({ children, props }: { children: React.ReactNode; props: AppbarProps }) {
  const [opened, { toggle }] = useDisclosure()
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
          <Group justify="space-between" style={{ flex: 1 }}>
            <Image
              src={logo}
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
              <UnstyledButton className={classes.control}>{props.dictionary.appbar.portfolio}</UnstyledButton>
            </Group>
            <AuthMenu dictionary={props.dictionary} />
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
        <UnstyledButton className={classes.control}>{props.dictionary.appbar.portfolio}</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>{children}</AppShell.Main>
    </AppShell>
  )
}
