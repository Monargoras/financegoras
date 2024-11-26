'use client'

import { ActionIcon, Menu, rem, Tooltip } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { IconCheck, IconLanguage } from '@tabler/icons-react'
import { i18n, type Locale } from '@/utils/i18nConfig'
import { Dictionary } from '@/utils/types'

interface LocaleSwitcherProps {
  dictionary: Dictionary
}

export default function LocaleSwitcher(props: LocaleSwitcherProps) {
  const pathName = usePathname()
  const router = useRouter()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    document.cookie = `NEXT_LOCALE=${locale}; path=/`
    return segments.join('/')
  }

  return (
    <Menu transitionProps={{ transition: 'pop' }}>
      <Menu.Target>
        <Tooltip label={props.dictionary.appbar.tooltipLanguageSwitch} position="bottom">
          <ActionIcon variant="subtle" aria-label="change language menu" color="gray">
            <IconLanguage />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {i18n.locales.map((locale) => (
          <Menu.Item
            key={locale}
            leftSection={
              i18n.locales.find((l) => pathName.startsWith(`/${l}`)) === locale && (
                <IconCheck style={{ width: rem(16), height: rem(16) }} />
              )
            }
            onClick={() => {
              router.push(redirectedPathName(locale))
              router.refresh()
            }}
          >
            {props.dictionary.general[locale]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
