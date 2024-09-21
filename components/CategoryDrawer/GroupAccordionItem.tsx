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
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconDots, IconPencil, IconPlus, IconX } from 'tabler-icons'
import { IconTrashX } from '@tabler/icons-react'
import { CategoryGroup, Dictionary } from '@/utils/types'
import CategoryItem from './CategoryItem'

interface GroupAccordionItemProps {
  item: CategoryGroup
  editing: string | null
  editingValue: string
  setEditing: (value: string | null) => void
  setEditingValue: (value: string) => void
  dictionary: Dictionary
  handleRenameGroup: (newName: string) => boolean
  handleDeleteGroup: (group: string) => boolean
  handleAddCategory: (groupName: string) => boolean
  handleRenameCategory: (newName: string) => boolean
  handleDeleteCategory: (category: string) => boolean
}

export default function GroupAccordionItem(props: GroupAccordionItemProps) {
  const { item, editing, editingValue, setEditing, setEditingValue } = props
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <Accordion.Item key={item.group} value={item.group}>
      <Center>
        <Accordion.Control {...props}>
          {editing === item.group ? (
            <Flex dir="row" onClick={(e) => e.stopPropagation()}>
              <FocusTrap>
                <TextInput
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      const success = props.handleRenameGroup(editingValue)
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
                  const success = props.handleRenameGroup(editingValue)
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
            <Text>{item.group}</Text>
          )}
        </Accordion.Control>
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
                setEditing(item.group)
                setEditingValue(item.group)
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
            {props.dictionary.budgetPage.deleteModalGroupText2}
            <Text style={{ marginLeft: 12 }}>
              {item.items.map((c) => (
                <>
                  - {c}
                  <br />
                </>
              ))}
              {item.items.length < 1 && <>-</>}
            </Text>
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
          key={category}
          category={category}
          editing={editing}
          editingValue={editingValue}
          setEditing={setEditing}
          setEditingValue={setEditingValue}
          dictionary={props.dictionary}
          handleRenameCategory={props.handleRenameCategory}
          handleDeleteCategory={props.handleDeleteCategory}
        />
      ))}
      <Accordion.Panel onClick={() => props.handleAddCategory(item.group)}>
        <Flex direction="row" align="center">
          <ActionIcon size="sm" variant="subtle">
            <IconPlus />
          </ActionIcon>
          <Text style={{ cursor: 'pointer' }} c="blue">
            {props.dictionary.budgetPage.addCategory}
          </Text>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
