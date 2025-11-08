import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
          role: user.role,
          status: user.status,
          avatar: user.avatar || undefined, // Convert null to undefined
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role
        token.status = user.status
        token.avatar = user.avatar
        token.name = user.name
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        console.log('JWT callback - updating token with session:', session)
        token.name = session.name || token.name
        token.avatar = session.avatar || token.avatar
      }
      
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.status = token.status as string
        session.user.avatar = token.avatar as string || undefined
        session.user.name = token.name as string
        console.log('Session callback - updated session user:', session.user)
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
export { authOptions }