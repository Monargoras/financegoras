import { Button, useMantineTheme } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Dictionary } from '@/utils/types'
import classes from './Appbar.module.css'

interface AuthMenuProps {
  dictionary: Dictionary
  unstyled?: boolean
}

export default function AuthMenu(props: AuthMenuProps) {
  const theme = useMantineTheme()
  const { data: session } = useSession()

  return (
    <div>
      {!session && (
        <Button
          size="md"
          onClick={() => signIn()}
          variant={props.unstyled ? 'subtle' : 'filled'}
          className={classes.control}
        >
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
          className={classes.control}
        >
          {props.dictionary.appbar.logout}
        </Button>
      )}
    </div>
  )
}
