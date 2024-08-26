'use client'

import { Button, Flex, Text } from '@mantine/core'
import { signIn } from 'next-auth/react'
import { Dictionary } from '@/utils/types'

interface AuthenticationPromptProps {
  dictionary: Dictionary
}

export default function AuthenticationPrompt(props: AuthenticationPromptProps) {
  return (
    <Flex justify="center" direction="column" align="center">
      <Text size="xl" mb={16}>
        {props.dictionary.general.logInPrompt}
      </Text>
      <Button size="xl" onClick={() => signIn()}>
        {props.dictionary.appbar.login}
      </Button>
    </Flex>
  )
}
