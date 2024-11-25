// auth.ts
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { Account } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from "@/models/authentication/authModel";
import { connect } from './dbconfigue/dbConfigue';
import { authConfig, AuthUser } from './auth.config';

export const config: NextAuthConfig = {
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          await connect();

          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            throw new Error('User not found');
          }

          if (user.provider && user.providerId && user.provider !== 'credentials') {
            throw new Error(
              `This account uses ${user.provider} authentication. Please sign in with ${user.provider}.`
            );
          }

          const isPasswordValid = await user.comparePassword(credentials.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            image: user.image,
            name: user.name,
            role: user.role,
            provider: user.provider,
            providerId: user.providerId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider;
        token.sessionId = `sess_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}` as string;
      }
      return token;
    },

    async signIn({ user, account }): Promise<boolean> {
      if (!user?.email) return false;

      try {
        await connect();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          if (account) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId,
              role: 'user', // Default role
            });
          } else {
            return false;
          }
        }

        if (account) {
          if (dbUser.provider && dbUser.provider !== account.provider && dbUser.provider !== 'credentials') {
            return false;
          }
          dbUser.providerId = account.providerAccountId;
          dbUser.provider = account.provider;
          await dbUser.save();
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.provider = dbUser.provider;
        user.providerId = dbUser.providerId;
        user.createdAt = dbUser.createdAt;
        user.updatedAt = dbUser.updatedAt;

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async session({ session, token }) {
      try {
        const user = await User.findById(token.id);

        if (user && session.user) {
          session.user.id = user._id.toString();
          session.user.role = user.role;
          session.user.email = user.email;
          session.user.name = user.name;
          session.user.image = user.image;
          session.user.provider = user.provider;
          session.user.providerId = user.providerId;
          session.user.createdAt = user.createdAt;
          session.user.updatedAt = user.updatedAt;
          session.sessionId = token.sessionId as string;
        }

        return session;
      } catch (error) {
        console.error('Session error:', error);
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.sessionId = token.sessionId as string;
        }
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/api/auth/callback')) {
        return `${baseUrl}/profile`;
      }

      if (url.includes('signOut') || url.includes('logout')) {
        return `${baseUrl}/authclient/Login`;
      }

      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/profile`;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
