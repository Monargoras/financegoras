'use client'

import { ComboboxItem, Flex, MultiSelect, OptionsFilter, Switch } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Dictionary, TransactionType } from '@/utils/types'

interface AnalysisControlsProps {
  dictionary: Dictionary
  listOfNames: string[]
  listOfCategories: string[]
  listOfGroups: string[]
  nameSearch: string[]
  setNameSearch: (newValue: string[]) => void
  categorySearch: string[]
  setCategorySearch: (newValue: string[]) => void
  groupSearch: string[]
  setGroupSearch: (newValue: string[]) => void
  typeFilter: string[]
  setTypeFilter: (newValue: string[]) => void
  dateRange: [Date | null, Date | null]
  setDateRange: (newValue: [Date | null, Date | null]) => void
  onlyExpenses: boolean
  setOnlyExpenses: (newValue: boolean) => void
}

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  )

  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}

export default function AnalysisControls(props: AnalysisControlsProps) {
  const allTypes = Object.values(TransactionType)
    .filter((el) => typeof el === 'string')
    .map((name) => ({ value: name, label: props.dictionary.budgetPage[name.toLocaleLowerCase()] }))

  return (
    <Flex gap="md" wrap="wrap" align="center" justify="center">
      <MultiSelect
        value={props.nameSearch}
        onChange={(value) => props.setNameSearch(value)}
        data={props.listOfNames}
        searchable
        placeholder={props.dictionary.analysisPage.searchName}
        hidePickedOptions
        filter={optionsFilter}
        clearable
        maw={500}
      />
      <MultiSelect
        value={props.categorySearch}
        onChange={(value) => props.setCategorySearch(value)}
        data={props.listOfCategories}
        searchable
        placeholder={props.dictionary.analysisPage.searchCategory}
        hidePickedOptions
        filter={optionsFilter}
        clearable
        maw={500}
      />
      <MultiSelect
        value={props.groupSearch}
        onChange={(value) => props.setGroupSearch(value)}
        data={props.listOfGroups}
        searchable
        placeholder={props.dictionary.analysisPage.searchGroup}
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
        checked={props.onlyExpenses}
        onChange={(event) => props.setOnlyExpenses(event.currentTarget.checked)}
        label={props.dictionary.analysisPage.onlyExpenses}
      />
    </Flex>
  )
}
