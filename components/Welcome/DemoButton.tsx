'use client'

import { Button, Flex } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { IconArrowRight } from 'tabler-icons'
import { Dictionary } from '@/utils/types'

interface DemoButtonProps {
  dictionary: Dictionary
}

export default function DemoButton(props: DemoButtonProps) {
  const router = useRouter()

  return (
    <Flex justify="center">
      <Button
        size="xl"
        rightSection={<IconArrowRight size={28} />}
        onClick={() => {
          router.push('/demo')
        }}
      >
        {props.dictionary.landingPage.demo}
      </Button>
    </Flex>
  )
}
