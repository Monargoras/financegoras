import { Avatar, Box, Button, Popover, Tooltip, useMantineTheme } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useSWRConfig } from 'swr'
import { Dictionary } from '@/utils/types'
import classes from './Appbar.module.css'

interface AuthMenuProps {
  dictionary: Dictionary
  unstyled?: boolean
}

export default function AuthMenu(props: AuthMenuProps) {
  const theme = useMantineTheme()
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()

  const clearCache = () => mutate(() => true, undefined, { revalidate: false })

  return (
    <Box>
      <Tooltip
        label={props.dictionary.budgetPage.fadedTransactionTooltip}
        withArrow
        multiline
        maw={300}
        visibleFrom="sm"
      >
        <Popover>
          <Popover.Target>
            <Box>
              {!session && (
                <Button
                  size="md"
                  onClick={() => signIn()}
                  variant={props.unstyled ? 'subtle' : 'filled'}
                  px={props.unstyled ? 16 : 'md'}
                  className={props.unstyled ? classes.control : undefined}
                >
                  {props.dictionary.appbar.login}
                </Button>
              )}
              {session && (
                <Avatar
                  src={session.user.image}
                  alt={session.user.name ?? 'User Profile'}
                  name={session.user.name ?? 'User Profile'}
                  color="initials"
                  style={{
                    cursor: 'pointer',
                  }}
                />
              )}
            </Box>
          </Popover.Target>
          <Popover.Dropdown>
            {session && (
              <Button
                size="md"
                c={theme.colors.red[5]}
                color={theme.colors.red[5]}
                variant="subtle"
                onClick={() => {
                  signOut()
                  clearCache()
                }}
              >
                {props.dictionary.appbar.logout}
              </Button>
            )}
          </Popover.Dropdown>
        </Popover>
      </Tooltip>
    </Box>
  )
}
