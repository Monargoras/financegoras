import { Button, useMantineTheme } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Dictionary } from '@/utils/types'

interface AuthMenuProps {
  dictionary: Dictionary
}

export default function AuthMenu(props: AuthMenuProps) {
  const theme = useMantineTheme()
  const { data: session } = useSession()

  return (
    <div>
      {!session && (
        <Button size="md" onClick={() => signIn()}>
          {props.dictionary.appbar.login}
        </Button>
      )}
      {session && (
        <Button
          size="md"
          c={theme.colors.red[5]}
          color={theme.colors.red[5]}
          variant="subtle"
          onClick={() => signOut()}
        >
          {props.dictionary.appbar.logout}
        </Button>
      )}
    </div>
  )
}
