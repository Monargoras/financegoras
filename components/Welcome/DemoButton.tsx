'use client'

import { forwardRef } from 'react'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconArrowRight } from 'tabler-icons'

interface DemoButtonProps {
  title: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  href: string
}

const DemoButtonRef = forwardRef<HTMLButtonElement, DemoButtonProps>((props, ref) => {
  const router = useRouter()

  return (
    <Button
      ref={ref}
      size={props.size}
      rightSection={<IconArrowRight size={28} />}
      onClick={() => {
        router.push(props.href)
      }}
    >
      {props.title}
    </Button>
  )
})

export default motion.create(DemoButtonRef)
