'use client'

import { ComboboxItem, Flex, MultiSelect, OptionsFilter, Switch } from '@mantine/core'
import { useState } from 'react'
import { Dictionary, TransactionType } from '@/utils/types'

interface TableControlsProps {
  dictionary: Dictionary
  listOfCategoriesAndNames: string[]
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

  const [earliestFirst, setEarliestFirst] = useState(true)
  const [catNameSearch, setCatNameSearch] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])

  return (
    <Flex gap="xs">
      <Switch
        checked={earliestFirst}
        onChange={(event) => setEarliestFirst(event.currentTarget.checked)}
        onLabel={props.dictionary.transactionsPage.earliestFirst}
        offLabel={props.dictionary.transactionsPage.latestFirst}
        size="xl"
      />
      <MultiSelect
        value={catNameSearch}
        onChange={(value) => setCatNameSearch(value)}
        data={props.listOfCategoriesAndNames}
        searchable
        placeholder={props.dictionary.transactionsPage.searchPlaceholder}
        hidePickedOptions
        filter={optionsFilter}
        clearable
        maw={500}
      />
      <MultiSelect
        value={typeFilter}
        onChange={(value) => setTypeFilter(value)}
        data={allTypes}
        placeholder={props.dictionary.transactionsPage.typeFilterPlaceholder}
        searchable
        clearable
      />
      {/* TODO timeframe select */}
    </Flex>
  )
}
