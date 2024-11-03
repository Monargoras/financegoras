'use client'

import { useState } from 'react'
import { YearPicker } from '@mantine/dates'
import { Button, Popover } from '@mantine/core'
import { Dictionary } from '@/utils/types'

interface TimeframeSelectProps {
  dictionary: Dictionary
  selectedYear: number
  setSelectedYear: (year: number) => void
  setSelectedMonth: (month: number) => void
  timeframe: string
  setTimeframe: (timeframe: string) => void
}

export default function TimeframeSelect(props: TimeframeSelectProps) {
  const [opened, setOpened] = useState(false)

  const selectLast12Months = () => {
    props.setTimeframe(props.dictionary.budgetPage.last12Months)
    props.setSelectedYear(new Date().getFullYear())
    props.setSelectedMonth(new Date().getMonth() + 1)
    setOpened(false)
  }

  return (
    <Popover opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Button onClick={() => setOpened((o) => !o)} variant="outline" color="gray" w={160}>
          {props.timeframe}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Button variant="subtle" color="gray" w="100%" onClick={selectLast12Months}>
          {props.dictionary.budgetPage.last12Months}
        </Button>
        <YearPicker
          value={
            props.timeframe === props.dictionary.budgetPage.last12Months ? null : new Date(props.selectedYear, 1, 1)
          }
          onChange={(date) => {
            if (!date) return
            props.setSelectedYear(date.getFullYear())
            props.setSelectedMonth(12)
            props.setTimeframe(date.getFullYear().toString())
            setOpened(false)
          }}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
