'use client'

import { forwardRef } from 'react'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconArrowRight } from 'tabler-icons'

interface DemoButtonProps {
  title: string
}

const DemoButtonRef = forwardRef<HTMLButtonElement, DemoButtonProps>((props, ref) => {
  const router = useRouter()

  return (
    <Button
      ref={ref}
      size="xl"
      rightSection={<IconArrowRight size={28} />}
      onClick={() => {
        router.push('/demo')
      }}
    >
      {props.title}
    </Button>
  )
})

export default motion(DemoButtonRef)
