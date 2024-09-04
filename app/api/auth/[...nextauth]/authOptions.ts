import { Session, SessionStrategy, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GithubProvider from 'next-auth/providers/github'

const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3003'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session?.user) {
        session.user.id = token.uid as string
      }
      return session
    },
    jwt: async ({ user, token }: { user: User; token: JWT }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  cookies: {
    sessionToken: {
      name: `${nextAuthUrl.startsWith('https://') ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        domain: nextAuthUrl === 'localhost' ? `.${nextAuthUrl}` : `.${new URL(nextAuthUrl).hostname}`, // support all subdomains
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: nextAuthUrl.startsWith('https://'),
      },
    },
  },
}
