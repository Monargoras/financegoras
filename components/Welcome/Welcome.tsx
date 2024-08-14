import { Title, Text, Anchor } from '@mantine/core'
import classes from './Welcome.module.css'

interface WelcomeProps {
  dictionary: { [key: string]: { [key: string]: string } }
}

export function Welcome(props: WelcomeProps) {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Mantine
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Next.js project includes a minimal setup for server side rendering, if you want to learn more on
        Mantine + Next.js integration follow{' '}
        <Anchor href="https://mantine.dev/guides/next/" size="lg">
          this guide
        </Anchor>
        . To get started edit page.tsx file.
      </Text>
      <Text>{props.dictionary.landingPage.welcome}</Text>
    </>
  )
}
