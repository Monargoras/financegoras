'use client'

import { useState } from 'react'
import { ActionIcon, Affix, Flex, Popover, Switch } from '@mantine/core'
import { IconSettings } from 'tabler-icons'
import { Dictionary } from '@/utils/types'
import TimeframeSelect from './TimeframeSelect'
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

  return (
    <Popover opened={opened} onChange={setOpened} transitionProps={{ transition: 'fade-up', duration: 150 }}>
      <Popover.Target>
        <Affix position={{ bottom: 20, right: 20 }} hiddenFrom="sm">
          <ActionIcon color="blue" radius="xl" size={60} onClick={() => setOpened((o) => !o)}>
            <IconSettings stroke={1.5} size={30} />
          </ActionIcon>
        </Affix>
      </Popover.Target>

      <Popover.Dropdown>
        <Flex direction="column" justify="center" align="flex-start" gap="md">
          <TimeframeSelect
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setSelectedMonth={setSelectedMonth}
            dictionary={props.dictionary}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <Flex direction="row" justify="space-between" w="100%" align="center" gap="md">
            <Switch
              checked={grouped}
              onChange={(event) => setGrouped(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.groups}
              offLabel={props.dictionary.budgetPage.categories}
              size="xl"
            />
            <MobileTooltipPopover label={props.dictionary.budgetPage.groupedTooltip} />
          </Flex>
          <Flex direction="row" justify="space-between" w="100%" align="center" gap="md">
            <Switch
              checked={percentage}
              onChange={(event) => setPercentage(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.percentage}
              offLabel={props.dictionary.budgetPage.sum}
              size="xl"
            />
            <MobileTooltipPopover label={props.dictionary.budgetPage.percentageTooltip} />
          </Flex>
          <Flex direction="row" justify="space-between" w="100%" align="center" gap="md">
            <Switch
              checked={includeSavings}
              onChange={(event) => setIncludeSavings(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.includeSavings}
              offLabel={props.dictionary.budgetPage.excludeSavings}
              size="xl"
            />
            <MobileTooltipPopover label={props.dictionary.budgetPage.includeSavingsTooltip} />
          </Flex>
          <Flex direction="row" justify="space-between" w="100%" align="center" gap="md">
            <Switch
              checked={includeEmptyCategories}
              onChange={(event) => setIncludeEmptyCategories(event.currentTarget.checked)}
              onLabel={props.dictionary.budgetPage.includeEmptyCategories}
              offLabel={props.dictionary.budgetPage.excludeEmptyCategories}
              size="xl"
            />
            <MobileTooltipPopover label={props.dictionary.budgetPage.includeEmptyCategoriesTooltip} />
          </Flex>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  )
}
