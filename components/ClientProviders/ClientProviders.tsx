'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

export default function ClientProviders({
  session,
  children,
}: {
  session: Session | null | undefined
  children: React.ReactNode
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
