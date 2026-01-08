'use client'

import { Button, Flex, Modal, Text, Input } from '@mantine/core'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { useSWRConfig } from 'swr'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { Categories, Category, CategoryGroup, Dictionary } from '@/utils/types'
import updateCategories from '@/serverActions/updateCategories'

interface CategoryImportModalProps {
  dictionary: Dictionary
  opened: boolean
  close: () => void
}

export default function CategoryImportModal(props: CategoryImportModalProps) {
  const { mutate } = useSWRConfig()
  const isMobile = useMediaQuery('(max-width: 50em)')
  const [categoryString, setCategoryString] = useState('')
  const [error, setError] = useState(false)

  const validateCategory = (value: unknown): value is Category => {
    const v = value as Category
    return typeof v === 'object' && v !== null && typeof v.name === 'string' && typeof v.color === 'string'
  }

  const validateGroup = (value: unknown): value is CategoryGroup => {
    const v = value as CategoryGroup
    return (
      typeof v === 'object' &&
      v !== null &&
      typeof v.group === 'string' &&
      typeof v.color === 'string' &&
      Array.isArray(v.items) &&
      v.items.every(validateCategory)
    )
  }

  const validateCategoryArray = (value: unknown): value is Categories[] => {
    return Array.isArray(value) && value.every(validateGroup)
  }

  const handleImport = async () => {
    let categories: Categories
    try {
      categories = JSON.parse(categoryString)
      validateCategoryArray(categories)
    } catch {
      setError(true)
      return
    }
    const success = await updateCategories(categories)
    if (success) {
      notifications.show({
        title: props.dictionary.transactionsPage.successfullyImportedCategriesTitle,
        message: props.dictionary.transactionsPage.successfullyImportedCategoriesMessage,
        color: 'green',
        icon: <IconCheck />,
        position: 'bottom-right',
      })
      mutate((key) => typeof key === 'string' && key.startsWith('/api/budget/') && key !== '/api/budget/getCategories')
      mutate((key) => typeof key === 'string' && key.startsWith('/api/transactions/'))
      mutate((key) => typeof key === 'string' && key.startsWith('/api/analysis/'))
      return true
    }
    notifications.show({
      title: props.dictionary.transactionsPage.importErrorTitle,
      message: props.dictionary.transactionsPage.importErrorMessage,
      color: 'red',
      icon: <IconX />,
      position: 'bottom-right',
    })
    return false
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      title={props.dictionary.transactionsPage.categoryImportTitle}
      fullScreen={isMobile}
      size="xl"
    >
      <Flex justify="center" align="center" gap="md" direction="column" wrap="wrap" style={{ textAlign: 'center' }}>
        <Input
          w={500}
          multiline
          value={categoryString}
          error={error}
          onChange={(event) => {
            setCategoryString(event.currentTarget.value)
            setError(false)
          }}
          component="textarea"
        />
        {error && <Text c="#fa5252">{props.dictionary.transactionsPage.errorParseCategories}</Text>}
        <Text>{props.dictionary.transactionsPage.truncateExistingCategories}</Text>
        <Text w={500}>{props.dictionary.transactionsPage.matchingCategories}</Text>
        <Flex justify="center" align="center" gap="md" direction="row" wrap="wrap">
          <Button variant="outline" color="green" onClick={props.close}>
            {props.dictionary.budgetPage.cancel}
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={async () => {
              const success = await handleImport()
              if (success) {
                props.close()
              }
            }}
          >
            {props.dictionary.transactionsPage.performImport}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
