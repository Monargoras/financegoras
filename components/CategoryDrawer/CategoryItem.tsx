'use client'

import { Accordion, ActionIcon, Flex, FocusTrap, Menu, rem, Text, TextInput } from '@mantine/core'
import { IconTrashX } from '@tabler/icons-react'
import { IconCheck, IconDots, IconPencil, IconX } from 'tabler-icons'
import { Dictionary } from '@/utils/types'

interface CateforyItemProps {
  category: string
  editing: string | null
  editingValue: string
  setEditing: (value: string | null) => void
  setEditingValue: (value: string) => void
  dictionary: Dictionary
  handleRenameCategory: (newName: string) => boolean
  handleDeleteCategory: () => void
}

export default function CategoryItem(props: CateforyItemProps) {
  const { category, editing, editingValue, setEditing, setEditingValue } = props

  return (
    <Accordion.Panel key={category} style={{ marginRight: -15 }}>
      <Flex dir="row" justify="space-between">
        {editing === category ? (
          <Flex style={{ width: '100%' }}>
            <FocusTrap>
              <TextInput
                value={editingValue}
                onChange={(event) => setEditingValue(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    const success = props.handleRenameCategory(editingValue)
                    if (success) {
                      setEditing(null)
                      setEditingValue('')
                    }
                  }
                }}
                style={{ width: '100%' }}
              />
            </FocusTrap>
            <ActionIcon
              size="lg"
              variant="subtle"
              color="green"
              onClick={() => {
                const success = props.handleRenameCategory(editingValue)
                if (success) {
                  setEditing(null)
                  setEditingValue('')
                }
              }}
            >
              <IconCheck />
            </ActionIcon>
            <ActionIcon
              size="lg"
              variant="subtle"
              color="red"
              onClick={() => {
                setEditing(null)
                setEditingValue('')
              }}
            >
              <IconX />
            </ActionIcon>
          </Flex>
        ) : (
          <Text>{category}</Text>
        )}
        <Menu>
          <Menu.Target>
            <ActionIcon size="lg" variant="subtle" color="gray">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
              c="blue"
              onClick={() => {
                setEditing(category)
                setEditingValue(category)
              }}
            >
              {props.dictionary.budgetPage.edit}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
              c="red"
              onClick={props.handleDeleteCategory}
            >
              {props.dictionary.budgetPage.delete}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Accordion.Panel>
  )
}
