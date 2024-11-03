import { Title, Text, Flex } from '@mantine/core'
import classes from './Welcome.module.css'
import { Dictionary } from '@/utils/types'

interface WelcomeProps {
  dictionary: Dictionary
}

export default function Welcome(props: WelcomeProps) {
  return (
    <Flex justify="center" direction="column">
      <Title className={classes.title} ta="center" mt={50}>
        <Text
          inherit
          variant="gradient"
          mx="auto"
          maw="max(50dvw, 800px)"
          gradient={{ from: 'primary.6', to: 'remaining.4' }}
        >
          {props.dictionary.landingPage.welcome}
        </Text>
      </Title>
      <Text ta="center" size="xl" maw="max(30dvw, 400px)" mx="auto" my="xl">
        {props.dictionary.landingPage.introText}
      </Text>
    </Flex>
  )
}
