'use client'

import { Select } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/middleware'
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
    <Select
      data={i18n.locales.map((locale) => ({ value: locale, label: props.dictionary.general[locale] }))}
      value={i18n.locales.find((locale) => pathName.startsWith(`/${locale}`))}
      allowDeselect={false}
      clearable={false}
      w={100}
      onChange={(value) => {
        if (!value) return
        router.push(redirectedPathName(value))
      }}
    />
  )
}
