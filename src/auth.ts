import NextAuth from 'next-auth';
import type { NextAuthConfig, Session, DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from "@/models/authentication/authModel";
import { connect } from './dbconfigue/dbConfigue';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role?: string;
      email?: string | null;
      name?: string | null;
    } & DefaultSession['user'];
    sessionId?: string;
  }

  interface User {
    id?: string;
    role?: string;
    email?: string | null;
    name?: string | null;
  }
}

const publicPaths: string[] = ['/authclient/Register', '/authclient/Login'];
const privatePaths: string[] = ['/profile'];

interface CustomToken extends JWT {
  id?: string;
  role?: string;
  sessionId?: string;
}

export const authOptions: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/authclient/Login',
    error: '/authclient/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }
          
          await connect();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('User not found');
          }
          
          // Modified this section to handle OAuth users differently
          if (user.provider && user.providerId && user.provider !== 'credentials') {
            throw new Error(`This account uses ${user.provider} authentication. Please sign in with ${user.provider}.`);
          }
          
          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      if (publicPaths.some(p => path.startsWith(p))) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/profile', nextUrl));
        }
        return true;
      }
      
      if (privatePaths.some(p => path.startsWith(p))) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/authclient/Login', nextUrl));
        }
        return true;
      }

      if (path === '/') {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/authclient/Login', nextUrl));
        }
        return Response.redirect(new URL('/profile', nextUrl));
      }

      return true;
    },
    
    async signIn({ user, account }) {
      if (!user?.email) return false;
      
      try {
        await connect();
        
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          if (account) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              provider: account.provider,
              providerId: account.providerAccountId,
            });
          } else {
            // This is a credentials sign-in for a new user
            return false;
          }
        }
        
        // Modified this section to handle provider conflicts
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
        
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async session({ session, token }: { session: Session; token: CustomToken }) {
      if (!token.email && !token.sub) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return null as any;
      }
      
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.sessionId = token.sessionId;
      }
      
      // Add provider information to session if needed
      if (token.provider) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).provider = token.provider;
      }
      
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);