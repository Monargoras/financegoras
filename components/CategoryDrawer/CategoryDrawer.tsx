'use client'

import { useDisclosure } from '@mantine/hooks'
import { Drawer, Text } from '@mantine/core'
import { Dictionary } from '@/utils/types'

interface CategoryDrawerProps {
  dictionary: Dictionary
}

export default function CategoryDrawer(props: CategoryDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={opened} onClose={close} title={props.dictionary.budgetPage.categories} position="right">
        {/* TODO Drawer content */}
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
