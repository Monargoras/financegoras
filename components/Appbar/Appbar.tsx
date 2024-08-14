'use client'

import { AppShell, Burger, Group, rem, UnstyledButton } from '@mantine/core'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logo from '../../public/financegoras_new.jpg'
import classes from './Appbar.module.css'

export function Appbar({ children }: { children: React.ReactNode }) {
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
            <Image src={logo} alt="Financegoras" width={32} height={32} />
            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton onClick={() => router.push('/')} className={classes.control}>
                Home
              </UnstyledButton>
              <UnstyledButton onClick={() => router.push('/budget')} className={classes.control}>
                Budget
              </UnstyledButton>
              <UnstyledButton className={classes.control}>Portfolio</UnstyledButton>
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
          Home
        </UnstyledButton>
        <UnstyledButton
          onClick={() => {
            router.push('/budget')
            toggle()
          }}
          className={classes.control}
        >
          Budget
        </UnstyledButton>
        <UnstyledButton className={classes.control}>Portfolio</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>{children}</AppShell.Main>
    </AppShell>
  )
}
