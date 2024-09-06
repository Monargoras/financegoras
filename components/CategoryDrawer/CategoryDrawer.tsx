'use client'

import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Accordion, Button, Drawer, Flex, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconX } from 'tabler-icons'
import { Categories, Dictionary } from '@/utils/types'
import GroupAccordionItem from './GroupAccordionItem'
import updateTransactionCategories from '@/serverActions/updateTransactionCategories'

interface CategoryDrawerProps {
  dictionary: Dictionary
  categories: Categories
  setCategories: (categories: Categories) => void
  setUpdateBackendCategories: (value: boolean) => void
}

export default function CategoryDrawer(props: CategoryDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false)
  // key of the category or group that is being edited
  const [editing, setEditing] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  // array holding all group names and categories to check for duplicates when adding new ones
  const allCategories = props.categories.reduce<string[]>((acc, item) => {
    acc.push(item.group)
    acc.push(...item.items)
    return acc
  }, [])

  const handleAddCategory = (groupName: string) => {
    // check if the default category name is already in use
    if (allCategories.includes(props.dictionary.budgetPage.defaultCategoryName)) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackAddGroupErrorTitle,
        message: props.dictionary.budgetPage.feedbackAddGroupErrorMessage,
        color: 'red',
        icon: <IconX />,
        position: 'bottom-right',
      })
      return false
    }
    // find the group that is being edited
    const group = props.categories.find((item) => item.group === groupName)
    if (group) {
      // find the index of the group in the array
      const index = props.categories.indexOf(group)
      // create a new group object with the new category
      const newGroup = { group: group.group, items: [...group.items, props.dictionary.budgetPage.defaultCategoryName] }
      // create a new categories array with the new group object
      const newCategories = [...props.categories]
      newCategories[index] = newGroup
      // set the new categories array
      props.setCategories(newCategories)
      setEditing(props.dictionary.budgetPage.defaultCategoryName)
      setEditingValue(props.dictionary.budgetPage.defaultCategoryName)
      props.setUpdateBackendCategories(true)
      return true
    }
    return false
  }

  const handleRenameCategory = (newName: string) => {
    // if value was not changed, close the editing mode
    if (newName === editing) {
      return true
    }
    // check if the new name is already in use
    if (allCategories.includes(newName) || !editing || !editingValue) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackAddGroupErrorTitle,
        message: props.dictionary.budgetPage.feedbackAddGroupErrorMessage,
        color: 'red',
        icon: <IconX />,
        position: 'bottom-right',
      })
      return false
    }
    // find the group that is being edited
    const group = props.categories.find((item) => item.items.includes(editing))
    if (group) {
      const success = updateTransactionCategories(editing, newName)
      if (!success) {
        return false
      }
      // find the index of the category in the array
      const index = props.categories.indexOf(group)
      // create a new category array with the new name
      const newItems = group.items.map((item) => (item === editing ? newName : item))
      // create a new category object with the new items array
      const newCategory = { group: group.group, items: newItems }
      // create a new categories array with the new category object
      const newCategories = [...props.categories]
      newCategories[index] = newCategory
      // set the new categories array
      props.setCategories(newCategories)
      props.setUpdateBackendCategories(true)
      return true
    }
    return false
  }

  const handleDeleteCategory = (category: string) => {
    // find the group of to be deleted category
    const group = props.categories.find((item) => item.items.includes(category))
    if (group) {
      // find the index of the category in the array
      const index = props.categories.indexOf(group)
      // create a new category array with the new name
      const newItems = group.items.filter((item) => item !== category)
      // create a new category object with the new items array
      const newCategory = { group: group.group, items: newItems }
      // create a new categories array with the new category object
      const newCategories = [...props.categories]
      newCategories[index] = newCategory
      // set the new categories array
      props.setCategories(newCategories)
      props.setUpdateBackendCategories(true)
      return true
    }
    return false
  }

  const handleAddGroup = () => {
    // check if the default group name is already in use
    if (allCategories.includes(props.dictionary.budgetPage.defaultGroupName)) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackAddGroupErrorTitle,
        message: props.dictionary.budgetPage.feedbackAddGroupErrorMessage,
        color: 'red',
        icon: <IconX />,
        position: 'bottom-right',
      })
      return false
    }
    // add a new group with a default name {props, dictionary.budgetPage.defaultGroupName}
    const newGroup = { group: props.dictionary.budgetPage.defaultGroupName, items: [] }
    props.setCategories([...props.categories, newGroup])
    setEditing(props.dictionary.budgetPage.defaultGroupName)
    setEditingValue(props.dictionary.budgetPage.defaultGroupName)
    props.setUpdateBackendCategories(true)
    return true
  }

  const handleRenameGroup = (newName: string) => {
    // if value was not changed, close the editing mode
    if (newName === editing) {
      return true
    }
    // check if the new name is already in use
    if (allCategories.includes(newName) || !editingValue) {
      notifications.show({
        title: props.dictionary.budgetPage.feedbackAddGroupErrorTitle,
        message: props.dictionary.budgetPage.feedbackAddGroupErrorMessage,
        color: 'red',
        icon: <IconX />,
        position: 'bottom-right',
      })
      return false
    }
    // find the group that is being edited
    const group = props.categories.find((item) => item.group === editing)
    if (group) {
      // find the index of the group in the array
      const index = props.categories.indexOf(group)
      // create a new group object with the new name
      const newGroup = { group: newName, items: group.items }
      // create a new array with the new group object
      const newCategories = [...props.categories]
      newCategories[index] = newGroup
      // set the new categories array
      props.setCategories(newCategories)
      props.setUpdateBackendCategories(true)
      return true
    }
    return false
  }

  const handleDeleteGroup = (group: string) => {
    // create a new categories array with the new category object
    const newCategories = [...props.categories]
    // filter groups
    const filteredCategories = newCategories.filter((item) => item.group !== group)
    // set the new categories array
    props.setCategories(filteredCategories)
    props.setUpdateBackendCategories(true)
    return true
  }

  const items = props.categories.map((item) => (
    <GroupAccordionItem
      key={item.group}
      item={item}
      editing={editing}
      editingValue={editingValue}
      setEditing={setEditing}
      setEditingValue={setEditingValue}
      dictionary={props.dictionary}
      handleRenameGroup={handleRenameGroup}
      handleDeleteGroup={handleDeleteGroup}
      handleAddCategory={handleAddCategory}
      handleRenameCategory={handleRenameCategory}
      handleDeleteCategory={handleDeleteCategory}
    />
  ))

  return (
    <>
      <Drawer opened={opened} onClose={close} title={props.dictionary.budgetPage.categories} position="right">
        <Accordion variant="contained" chevronPosition="left">
          {items}
        </Accordion>
        <Flex justify="center" style={{ margin: 4 }}>
          <Button onClick={handleAddGroup}>{props.dictionary.budgetPage.addGroup}</Button>
        </Flex>
      </Drawer>

      <Text
        c="blue"
        onClick={(e) => {
          e.preventDefault()
          open()
        }}
        size="sm"
        style={{ cursor: 'pointer' }}
      >
        {props.dictionary.budgetPage.edit}
      </Text>
    </>
  )
}
