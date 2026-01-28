import bcrypt from 'bcryptjs'
import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'
import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import GitHubProvider, { type GithubProfile } from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '@/lib/prisma'

// Derives a deterministic nickname for OAuth users from a provider seed.
const oauthNickName = (seed: string) => {
  const hex = createHash('sha256').update(seed).digest('hex')
  const digits = (parseInt(hex.slice(0, 8), 16) % 1_000_000_000).toString().padStart(9, '0')
  return `USER_${digits}`
}

// Records a user's login once per day (UTC), updating the timestamp if it already exists.
const recordDailyLogin = async (userId: string) => {
  const now = new Date()
  const loginDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  await prisma.userDailyLogin.upsert({
    where: {
      userId_loginDate: {
        userId,
        loginDate,
      },
    },
    update: {
      loggedAt: now,
    },
    create: {
      userId,
      loginDate,
      loggedAt: now,
    },
  })
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 48,
  },
  jwt: {
    // Custom JWT encode/decode to keep compatibility with session strategy.
    async encode({ token, secret }) {
      return jwt.sign(token as object, secret, {
        algorithm: 'HS256',
      })
    },
    async decode({ token, secret }) {
      if (!token) return null
      return jwt.verify(token, secret) as unknown as Record<string, unknown>
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Missing email or password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          nickName: user.nickName,
          firstName: user.firstName,
          lastName: user.lastName,
        } satisfies User
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: GoogleProfile) {
        const nickName = oauthNickName(`google:${profile.sub}`)
        return {
          id: profile.sub,
          name: profile.name ?? nickName,
          email: profile.email ?? null,
          image: profile.picture ?? null,
          nickName,
          firstName: profile.given_name ?? null,
          lastName: profile.family_name ?? null,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile: GithubProfile) {
        const nickName = oauthNickName(`github:${profile.id}`)
        return {
          id: profile.id.toString(),
          name: profile.name ?? nickName,
          email: profile.email ?? null,
          image: profile.avatar_url ?? null,
          nickName,
        }
      },
    }),
  ],
  callbacks: {
    // Persist the user id in the token.
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    // Attach user id to session and log daily login without blocking auth.
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        try {
          await recordDailyLogin(token.id)
        } catch {
          // no-op: login tracking should not block sessions
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
