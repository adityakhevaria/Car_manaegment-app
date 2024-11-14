import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/app/lib/prisma'
import { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) session.user.id = token.id as string
      return session
    },
  },
  pages: { signIn: '/login' },
}

// This is how you define your route handler for GET and POST requests
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
