'use client'

import { Flex, Switch, Tooltip } from '@mantine/core'
import { DashboardData, Dictionary } from '@/utils/types'
import CategoryRadar from './CategoryRadar'
import MonthlyExpenseEvolutionGraph from './MonthlyExpenseEvolutionGraph'
import { MonthlyStats } from './MonthlyStats'
import { TransactionTable } from './TransactionTable'
import AggregatedIncExpEvolutionGraph from './AggregatedIncExpEvolutionGraph'
import TimeframeSelect from './TimeframeSelect'
import updateUserSettings from '@/serverActions/updateUserSettings'
import FloatingSettingsMenu from './FloatingSettingsMenu'

interface DashboardProps {
  lang: string
  dictionary: Dictionary
  demo: boolean
  data: DashboardData
  grouped: boolean
  setGrouped: (grouped: boolean) => void
  includeSavings: boolean
  setIncludeSavings: (includeSavings: boolean) => void
  selectedMonth: number
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

export default function Dashboard(props: DashboardProps) {
  const {
    data,
    grouped,
    includeSavings,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    timeframe,
    setTimeframe,
    includeEmptyCategories,
    percentage,
  } = props

  const updateDatabaseUserSettings = async (
    newGrouped: boolean,
    newPercentage: boolean,
    newIncludeSavings: boolean,
    newIncludeEmptyCategories: boolean
  ) => {
    if (!props.demo) {
      await updateUserSettings(newGrouped, newPercentage, newIncludeSavings, newIncludeEmptyCategories)
    }
  }

  const setGrouped = (val: boolean) => {
    updateDatabaseUserSettings(val, percentage, includeSavings, includeEmptyCategories)
    props.setGrouped(val)
  }

  const setPercentage = (val: boolean) => {
    updateDatabaseUserSettings(grouped, val, includeSavings, includeEmptyCategories)
    props.setPercentage(val)
  }

  const setIncludeSavings = (val: boolean) => {
    updateDatabaseUserSettings(grouped, percentage, val, includeEmptyCategories)
    props.setIncludeSavings(val)
  }

  const setIncludeEmptyCategories = (val: boolean) => {
    updateDatabaseUserSettings(grouped, percentage, includeSavings, val)
    props.setIncludeEmptyCategories(val)
  }

  return (
    <Flex direction="column">
      <Flex
        direction="row"
        justify="center"
        align="center"
        gap="md"
        style={{ marginBottom: 8 }}
        wrap="wrap"
        visibleFrom="sm"
      >
        <Tooltip
          refProp="rootRef"
          maw={250}
          multiline
          label={props.dictionary.budgetPage.groupedTooltip}
          position="bottom"
        >
          <Switch
            checked={grouped}
            onChange={(event) => setGrouped(event.currentTarget.checked)}
            onLabel={props.dictionary.budgetPage.groups}
            offLabel={props.dictionary.budgetPage.categories}
            size="xl"
          />
        </Tooltip>
        <Tooltip
          refProp="rootRef"
          maw={250}
          multiline
          label={props.dictionary.budgetPage.percentageTooltip}
          position="bottom"
        >
          <Switch
            checked={percentage}
            onChange={(event) => setPercentage(event.currentTarget.checked)}
            onLabel={props.dictionary.budgetPage.percentage}
            offLabel={props.dictionary.budgetPage.sum}
            size="xl"
          />
        </Tooltip>
        <TimeframeSelect
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
          dictionary={props.dictionary}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          floatingMenu={false}
        />
        <Tooltip
          refProp="rootRef"
          maw={250}
          multiline
          label={props.dictionary.budgetPage.includeSavingsTooltip}
          position="bottom"
        >
          <Switch
            checked={includeSavings}
            onChange={(event) => setIncludeSavings(event.currentTarget.checked)}
            onLabel={props.dictionary.budgetPage.includeSavings}
            offLabel={props.dictionary.budgetPage.excludeSavings}
            size="xl"
          />
        </Tooltip>
        <Tooltip
          refProp="rootRef"
          maw={250}
          multiline
          label={props.dictionary.budgetPage.includeEmptyCategoriesTooltip}
          position="bottom"
        >
          <Switch
            checked={includeEmptyCategories}
            onChange={(event) => setIncludeEmptyCategories(event.currentTarget.checked)}
            onLabel={props.dictionary.budgetPage.includeEmptyCategories}
            offLabel={props.dictionary.budgetPage.excludeEmptyCategories}
            size="xl"
          />
        </Tooltip>
      </Flex>
      <Flex direction="row" justify="center" align="center" gap="md" wrap="wrap">
        <MonthlyExpenseEvolutionGraph
          lang={props.lang}
          dictionary={props.dictionary}
          percentage={percentage}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
          timeframe={timeframe}
          data={data.monthlyExpenseEvolution}
        />
        <CategoryRadar
          lang={props.lang}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          data={data.expensesByCategory}
        />
      </Flex>
      <Flex gap="md" justify="center" direction="row" wrap="wrap">
        <Flex gap="md" align="center" direction="column" wrap="wrap">
          <MonthlyStats dictionary={props.dictionary} data={data.monthlyStats} />
          <AggregatedIncExpEvolutionGraph
            lang={props.lang}
            dictionary={props.dictionary}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            timeframe={timeframe}
            percentage={percentage}
            data={data.incExpEvolution}
          />
        </Flex>
        <TransactionTable
          dictionary={props.dictionary}
          demo={props.demo}
          data={data.transactions}
          categories={data.categories}
        />
      </Flex>
      <FloatingSettingsMenu
        dictionary={props.dictionary}
        lang={props.lang}
        grouped={grouped}
        setGrouped={setGrouped}
        percentage={percentage}
        setPercentage={setPercentage}
        includeSavings={includeSavings}
        setIncludeSavings={setIncludeSavings}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        includeEmptyCategories={includeEmptyCategories}
        setIncludeEmptyCategories={setIncludeEmptyCategories}
      />
    </Flex>
  )
}
