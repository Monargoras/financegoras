'use client'

import { Accordion, ActionIcon, ColorPicker, Flex, FocusTrap, Menu, Popover, rem, Text, TextInput } from '@mantine/core'
import { IconCheck, IconColorPicker, IconDots, IconPencil, IconX, IconTrashX } from '@tabler/icons-react'
import { Category, Dictionary } from '@/utils/types'
import { colorsHex } from '@/utils/helpers'

interface CateforyItemProps {
  category: Category
  editing: string | null
  editingValue: string
  editingColor: string
  setEditing: (value: string | null) => void
  setEditingValue: (value: string) => void
  setEditingColor: (value: string) => void
  dictionary: Dictionary
  handleUpdateCategory: (newName: string, newColor: string) => boolean
  handleDeleteCategory: (category: string) => boolean
}

export default function CategoryItem(props: CateforyItemProps) {
  const { category, editing, editingValue, editingColor, setEditing, setEditingValue, setEditingColor } = props

  return (
    <Accordion.Panel key={category.name} style={{ marginRight: -15 }}>
      <Flex dir="row" justify="space-between">
        {editing === category.name ? (
          <Flex style={{ width: '100%' }}>
            <FocusTrap>
              <TextInput
                value={editingValue}
                onChange={(event) => setEditingValue(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    const success = props.handleUpdateCategory(editingValue, editingColor)
                    if (success) {
                      setEditing(null)
                      setEditingValue('')
                      setEditingColor('')
                    }
                  }
                }}
                style={{ width: '100%' }}
              />
            </FocusTrap>
            <Popover withArrow shadow="md">
              <Popover.Target>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  tabIndex={-1}
                  style={{ backgroundColor: editingColor }}
                  radius={20}
                  ml={4}
                >
                  <IconColorPicker />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <ColorPicker value={editingColor} onChange={setEditingColor} format="hex" swatches={colorsHex} />
              </Popover.Dropdown>
            </Popover>
            <ActionIcon
              size="lg"
              variant="subtle"
              color="green"
              onClick={() => {
                const success = props.handleUpdateCategory(editingValue, editingColor)
                if (success) {
                  setEditing(null)
                  setEditingValue('')
                  setEditingColor('')
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
                setEditingColor('')
              }}
            >
              <IconX />
            </ActionIcon>
          </Flex>
        ) : (
          <Flex align="center" w="100%">
            <Text>{category.name}</Text>
            <Flex
              ml="auto"
              mr={15}
              tabIndex={-1}
              style={{ backgroundColor: category.color, borderRadius: 20, height: 20, width: 20 }}
            />
          </Flex>
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
              c="primary"
              onClick={() => {
                setEditing(category.name)
                setEditingValue(category.name)
                setEditingColor(category.color)
              }}
            >
              {props.dictionary.budgetPage.edit}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
              c="red"
              onClick={() => props.handleDeleteCategory(category.name)}
            >
              {props.dictionary.budgetPage.delete}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Accordion.Panel>
  )
}
