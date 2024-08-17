import { Button } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Dictionary } from '@/utils/types'

interface AuthMenuProps {
  dictionary: Dictionary
}

export default function AuthMenu(props: AuthMenuProps) {
  const { data: session } = useSession()

  return (
    <div>
      {!session && <Button onClick={() => signIn()}>{props.dictionary.appbar.login}</Button>}
      {session && (
        <Button color="red" onClick={() => signOut()}>
          {props.dictionary.appbar.logout}
        </Button>
      )}
    </div>
  )
}
