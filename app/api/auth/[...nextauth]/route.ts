import NextAuth, { DefaultSession } from 'next-auth'
import { authOptions } from './authOptions'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
