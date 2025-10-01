'use client'

import { ComboboxItem, Flex, MultiSelect, OptionsFilter, Switch } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Dictionary, Transaction, TransactionType } from '@/utils/types'
import ExportImportData from './ExportImportData'

interface TableControlsProps {
  dictionary: Dictionary
  listOfCategoriesAndNames: string[]
  earliestFirst: boolean
  setEarliestFirst: (newValue: boolean) => void
  hideStopped: boolean
  setHideStopped: (newValue: boolean) => void
  catNameSearch: string[]
  setCatNameSearch: (newValue: string[]) => void
  typeFilter: string[]
  setTypeFilter: (newValue: string[]) => void
  dateRange: [Date | null, Date | null]
  setDateRange: (newValue: [Date | null, Date | null]) => void
  transactions: Transaction[]
}

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  )

  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}

export default function TableControls(props: TableControlsProps) {
  const allTypes = Object.values(TransactionType)
    .filter((el) => typeof el === 'string')
    .map((name) => ({ value: name, label: props.dictionary.budgetPage[name.toLocaleLowerCase()] }))

  return (
    <Flex gap="md" wrap="wrap" align="center" justify="center">
      <MultiSelect
        value={props.catNameSearch}
        onChange={(value) => props.setCatNameSearch(value)}
        data={props.listOfCategoriesAndNames}
        searchable
        placeholder={props.dictionary.transactionsPage.searchPlaceholder}
        hidePickedOptions
        filter={optionsFilter}
        clearable
        maw={500}
      />
      <MultiSelect
        value={props.typeFilter}
        onChange={(value) => props.setTypeFilter(value)}
        data={allTypes}
        placeholder={props.dictionary.transactionsPage.typeFilterPlaceholder}
        searchable
        clearable
      />
      <DatePickerInput
        type="range"
        placeholder={props.dictionary.transactionsPage.pickDatesRange}
        value={props.dateRange}
        onChange={props.setDateRange}
        clearable
      />
      <Switch
        checked={props.earliestFirst}
        onChange={(event) => props.setEarliestFirst(event.currentTarget.checked)}
        label={props.dictionary.transactionsPage.earliestFirst}
      />
      <Switch
        checked={props.hideStopped}
        onChange={(event) => props.setHideStopped(event.currentTarget.checked)}
        label={props.dictionary.transactionsPage.hideStopped}
      />
      <ExportImportData dictionary={props.dictionary} transactions={props.transactions} />
    </Flex>
  )
}
