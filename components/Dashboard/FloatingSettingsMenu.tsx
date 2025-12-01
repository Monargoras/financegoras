'use client'

import { useState } from 'react'
import { ActionIcon, Affix, Button, Divider, Flex, Popover, Switch } from '@mantine/core'
import { YearPicker } from '@mantine/dates'
import { IconSettings } from '@tabler/icons-react'
import { Dictionary } from '@/utils/types'
import MobileTooltipPopover from './MobileTooltipPopover'

interface FloatingSettingsMenuProps {
  lang: string
  dictionary: Dictionary
  grouped: boolean
  setGrouped: (grouped: boolean) => void
  includeSavings: boolean
  setIncludeSavings: (includeSavings: boolean) => void
  setSelectedMonth: (selectedMonth: number) => void
  selectedYear: number
  setSelectedYear: (selectedYear: number) => void
  timeframe: string
  setTimeframe: (timeframe: string) => void
  includeEmptyCategories: boolean
  setIncludeEmptyCategories: (includeEmptyCategories: boolean) => void
  percentage: boolean
  setPercentage: (percentage: boolean) => void
}

export default function FloatingSettingsMenu(props: FloatingSettingsMenuProps) {
  const {
    grouped,
    setGrouped,
    includeSavings,
    setIncludeSavings,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    timeframe,
    setTimeframe,
    includeEmptyCategories,
    setIncludeEmptyCategories,
    percentage,
    setPercentage,
  } = props
  const [opened, setOpened] = useState(false)

  const selectLast12Months = () => {
    setTimeframe(props.dictionary.budgetPage.last12Months)
    setSelectedYear(new Date().getFullYear())
    setSelectedMonth(new Date().getMonth() + 1)
    setOpened(false)
  }

  return (
    <Popover opened={opened} onChange={setOpened} transitionProps={{ transition: 'fade-up', duration: 150 }}>
      <Popover.Target>
        <Affix position={{ bottom: 20, right: 20 }} hiddenFrom="sm">
          <ActionIcon color="primary" radius="xl" size={50} onClick={() => setOpened((o) => !o)}>
            <IconSettings stroke={1.5} size={30} />
          </ActionIcon>
        </Affix>
      </Popover.Target>

      <Popover.Dropdown>
        <Flex direction="column" justify="center" align="flex-start" gap="xs">
          <Flex direction="column" justify="center" align="flex-start">
            <Button variant="subtle" color="gray" w="100%" onClick={selectLast12Months}>
              {props.dictionary.budgetPage.last12Months}
            </Button>
            <YearPicker
              value={timeframe === props.dictionary.budgetPage.last12Months ? null : new Date(selectedYear, 1, 1)}
              onChange={(date) => {
                if (!date) {
                  return
                }
                setSelectedYear(date.getFullYear())
                setSelectedMonth(12)
                setTimeframe(date.getFullYear().toString())
                setOpened(false)
              }}
            />
          </Flex>
          <Divider w="100%" size="md" />
          <Flex direction="row" justify="flex-start" w="100%" align="center" gap="md">
            <MobileTooltipPopover label={props.dictionary.budgetPage.groupedTooltip} />
            <Switch
              checked={grouped}
              onChange={(event) => setGrouped(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.groups}
              offLabel={props.dictionary.budgetPage.categories}
              size="xl"
            />
          </Flex>
          <Flex direction="row" justify="flex-start" w="100%" align="center" gap="md">
            <MobileTooltipPopover label={props.dictionary.budgetPage.percentageTooltip} />
            <Switch
              checked={percentage}
              onChange={(event) => setPercentage(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.percentage}
              offLabel={props.dictionary.budgetPage.sum}
              size="xl"
            />
          </Flex>
          <Flex direction="row" justify="flex-start" w="100%" align="center" gap="md">
            <MobileTooltipPopover label={props.dictionary.budgetPage.includeSavingsTooltip} />
            <Switch
              checked={includeSavings}
              onChange={(event) => setIncludeSavings(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.includeSavings}
              offLabel={props.dictionary.budgetPage.excludeSavings}
              size="xl"
            />
          </Flex>
          <Flex direction="row" justify="flex-start" w="100%" align="center" gap="md">
            <MobileTooltipPopover label={props.dictionary.budgetPage.includeEmptyCategoriesTooltip} />
            <Switch
              checked={includeEmptyCategories}
              onChange={(event) => setIncludeEmptyCategories(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.includeEmptyCategories}
              offLabel={props.dictionary.budgetPage.excludeEmptyCategories}
              size="xl"
            />
          </Flex>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  )
}
