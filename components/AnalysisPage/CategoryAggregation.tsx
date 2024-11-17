'use client'

import { useContext } from 'react'
import { Table, useMantineTheme } from '@mantine/core'
import { Dictionary, CategoryAggregationData } from '@/utils/types'
import generalClasses from '@/utils/general.module.css'
import { PrivacyModeContext } from '@/components/ClientProviders/ClientProviders'

interface CategoryAggregationProps {
  dictionary: Dictionary
  data: CategoryAggregationData
}

export default function CategoryAggregation(props: CategoryAggregationProps) {
  const theme = useMantineTheme()
  const { privacyMode } = useContext(PrivacyModeContext)

  return (
    <>
      <Table.ScrollContainer
        h="40dvh"
        miw={{ xl: 600, md: 530, base: 300 }}
        minWidth={350}
        className={generalClasses.styledScroll}
      >
        <Table striped highlightOnHover stickyHeader withTableBorder stickyHeaderOffset={-1}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{props.dictionary.budgetPage.name}</Table.Th>
              <Table.Th>{props.dictionary.analysisPage.average}</Table.Th>
              <Table.Th>{props.dictionary.analysisPage.sum}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {props.data.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td>{d.name}</Table.Td>
                <Table.Td
                  c={
                    d.isIncome ? theme.colors.income[5] : d.isSavings ? theme.colors.saving[5] : theme.colors.expense[5]
                  }
                >
                  {privacyMode ? '**.**' : d.average.toFixed(2)}€
                </Table.Td>
                <Table.Td
                  c={
                    d.isIncome ? theme.colors.income[5] : d.isSavings ? theme.colors.saving[5] : theme.colors.expense[5]
                  }
                >
                  {privacyMode ? '**.**' : d.total.toFixed(2)}€
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}
