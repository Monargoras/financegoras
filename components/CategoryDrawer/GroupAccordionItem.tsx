'use client'

import {
  Accordion,
  ActionIcon,
  Center,
  Flex,
  Menu,
  TextInput,
  Text,
  rem,
  FocusTrap,
  Modal,
  Button,
  ColorPicker,
  Popover,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconDots, IconPencil, IconPlus, IconX, IconColorPicker, IconTrashX } from '@tabler/icons-react'
import { CategoryGroup, Dictionary } from '@/utils/types'
import CategoryItem from './CategoryItem'
import { colorsHex } from '@/utils/helpers'

interface GroupAccordionItemProps {
  item: CategoryGroup
  editing: string | null
  editingValue: string
  editingColor: string
  setEditing: (value: string | null) => void
  setEditingValue: (value: string) => void
  setEditingColor: (value: string) => void
  dictionary: Dictionary
  handleUpdateGroup: (newName: string, newColor: string) => boolean
  handleDeleteGroup: (group: string) => boolean
  handleAddCategory: (groupName: string) => boolean
  handleUpdateCategory: (newName: string, newColor: string) => boolean
  handleDeleteCategory: (category: string) => boolean
}

export default function GroupAccordionItem(props: GroupAccordionItemProps) {
  const { item, editing, editingValue, editingColor, setEditing, setEditingValue, setEditingColor } = props
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <Accordion.Item key={item.group} value={item.group}>
      <Center>
        <Accordion.Control>
          {editing === item.group ? (
            <Flex dir="row" onClick={(e) => e.stopPropagation()}>
              <FocusTrap>
                <TextInput
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      const prevOpened = opened
                      const success = props.handleUpdateGroup(editingValue, editingColor)
                      if (success) {
                        setEditing(null)
                        setEditingValue('')
                        setEditingColor('')
                        if (prevOpened) {
                          open()
                        } else {
                          close()
                        }
                      }
                    }
                  }}
                  maxLength={50}
                  style={{ width: '100%' }}
                />
              </FocusTrap>
            </Flex>
          ) : (
            <Flex>
              <Text>{item.group}</Text>
              <Flex
                ml="auto"
                tabIndex={-1}
                style={{ backgroundColor: item.color, borderRadius: 20, height: 20, width: 20 }}
              />
            </Flex>
          )}
        </Accordion.Control>
        {editing === item.group && (
          <Flex>
            <Popover withArrow shadow="md">
              <Popover.Target>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  tabIndex={-1}
                  style={{ backgroundColor: editingColor }}
                  radius={20}
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
                const prevOpened = opened
                const success = props.handleUpdateGroup(editingValue, editingColor)
                if (success) {
                  setEditing(null)
                  setEditingValue('')
                  setEditingColor('')
                  if (prevOpened) {
                    open()
                  } else {
                    close()
                  }
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
        )}
        <Menu>
          <Menu.Target>
            <ActionIcon size="lg" variant="subtle" color="gray" tabIndex={-1}>
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
              c="primary"
              onClick={() => {
                setEditing(item.group)
                setEditingValue(item.group)
                setEditingColor(item.color)
              }}
            >
              {props.dictionary.budgetPage.edit}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />} c="red" onClick={open}>
              {props.dictionary.budgetPage.delete}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Modal opened={opened} onClose={close} title={props.dictionary.budgetPage.deleteModalGroupTitle} centered>
          <Text>
            {props.dictionary.budgetPage.deleteModalGroupText1} &quot;{item.group}&quot; <br />{' '}
            {props.dictionary.budgetPage.deleteModalGroupText2} <br />
            <span>
              {item.items.map((c) => (
                <span key={c.name} style={{ marginLeft: 12 }}>
                  - {c.name}
                  <br />
                </span>
              ))}
              {item.items.length < 1 && (
                <span style={{ marginLeft: 12 }}>
                  -
                  <br />
                </span>
              )}
            </span>
            {props.dictionary.budgetPage.deleteModalGroupText3}
          </Text>
          <Flex gap="md" justify="end">
            <Button onClick={close} variant="light">
              {props.dictionary.budgetPage.cancel}
            </Button>
            <Button
              leftSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
              color="red"
              onClick={() => props.handleDeleteGroup(item.group)}
            >
              {props.dictionary.budgetPage.delete}
            </Button>
          </Flex>
        </Modal>
      </Center>
      {item.items.map((category) => (
        <CategoryItem
          key={category.name}
          category={category}
          editing={editing}
          editingValue={editingValue}
          editingColor={editingColor}
          setEditing={setEditing}
          setEditingValue={setEditingValue}
          setEditingColor={setEditingColor}
          dictionary={props.dictionary}
          handleUpdateCategory={props.handleUpdateCategory}
          handleDeleteCategory={props.handleDeleteCategory}
        />
      ))}
      <Accordion.Panel onClick={() => props.handleAddCategory(item.group)}>
        <Flex direction="row" align="center">
          <ActionIcon size="sm" variant="subtle">
            <IconPlus />
          </ActionIcon>
          <Text style={{ cursor: 'pointer' }} c="primary">
            {props.dictionary.budgetPage.addCategory}
          </Text>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
