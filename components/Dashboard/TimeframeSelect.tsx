'use client'

import { YearPicker } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Select } from '@mantine/core'
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
  const [opened, { open, close }] = useDisclosure(false)

  const selectLast12Months = () => {
    props.setTimeframe(props.dictionary.budgetPage.last12Months)
    props.setSelectedYear(new Date().getFullYear())
    props.setSelectedMonth(new Date().getMonth() + 1)
  }

  return (
    <>
      <Select
        allowDeselect={false}
        clearable={false}
        value={props.timeframe}
        onChange={(value) => {
          if (value === props.dictionary.budgetPage.selectYear) {
            open()
            props.setTimeframe(props.dictionary.budgetPage.selectYear)
          } else if (value === props.dictionary.budgetPage.last12Months) {
            selectLast12Months()
            props.setTimeframe(props.dictionary.budgetPage.last12Months)
          } else if (value) {
            props.setTimeframe(value)
            props.setSelectedYear(parseInt(value, 10))
            props.setSelectedMonth(12)
          }
        }}
        data={[
          props.dictionary.budgetPage.last12Months,
          props.selectedYear.toString(),
          props.dictionary.budgetPage.selectYear,
        ]}
      />
      <Modal opened={opened} onClose={close} size="auto">
        <YearPicker
          value={new Date(props.selectedYear, 0, 1)}
          onChange={(date) => {
            if (!date) return
            props.setSelectedYear(date.getFullYear())
            props.setSelectedMonth(12)
            props.setTimeframe(date.getFullYear().toString())
            close()
          }}
        />
      </Modal>
    </>
  )
}
