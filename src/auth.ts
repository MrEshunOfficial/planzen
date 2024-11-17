import NextAuth from 'next-auth';
import type { NextAuthConfig, Session, DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from "@/models/authentication/authModel";
import { connect } from './dbconfigue/dbConfigue';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role: string;
      email?: string | null;
      name?: string | null;
      provider?: string | null;
      providerId?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    } & DefaultSession['user'];
    sessionId?: string;
  }

  interface User {
    id?: string;
    role: string;
    email?: string | null;
    name?: string | null;
    provider?: string | null;
    providerId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

const publicPaths: string[] = ['/', '/authclient/Register', '/authclient/Login'];
const privatePaths: string[] = ['/profile'];

interface CustomToken extends JWT {
  id?: string;
  role?: string;
  provider?: string;
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
    signOut: '/authclient/Login',
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
            role: user.role,
            provider: user.provider,
            providerId: user.providerId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider;
        
        if (!token.sessionId) {
          token.sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
        }
      }
      return token;
    },

    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Handle public paths
      if (publicPaths.some(p => path.startsWith(p))) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/profile', nextUrl));
        }
        return true;
      }
      
      // Handle private paths
      if (privatePaths.some(p => path.startsWith(p))) {
        if (!isLoggedIn) {
          const callbackUrl = encodeURIComponent(path);
          return Response.redirect(new URL(`/authclient/Login?callbackUrl=${callbackUrl}`, nextUrl));
        }
        return true;
      }

      // Handle root path
      if (path === '/') {
        return isLoggedIn
          ? Response.redirect(new URL('/profile', nextUrl))
          : Response.redirect(new URL('/authclient/Login', nextUrl));
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

    async session({ session, token }: { session: Session; token: CustomToken }) {
      if (!token.email && !token.sub) {
        return null as any;
      }
      
      try {
        const user = await User.findById(token.id);
        
        if (user && session.user) {
          session.user.id = user._id.toString();
          session.user.role = user.role;
          session.user.email = user.email;
          session.user.name = user.name;
          session.user.provider = user.provider;
          session.user.providerId = user.providerId;
          session.user.createdAt = user.createdAt;
          session.user.updatedAt = user.updatedAt;
          session.sessionId = token.sessionId;
        }
        
        return session;
      } catch (error) {
        console.error('Error fetching user data for session:', error);
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.sessionId = token.sessionId;
        }
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      // Special case for Google OAuth callback
      if (url.startsWith('/api/auth/callback/google')) {
        return `${baseUrl}/profile`;
      }

      // Handle sign-out redirects
      if (url.includes('signOut') || url.includes('logout')) {
        return `${baseUrl}/authclient/Login`;
      }
      
      // Handle callback redirects
      if (url.startsWith('/api/auth/callback')) {
        return `${baseUrl}/profile`;
      }

      // Handle relative URLs
      if (url.startsWith('/')) {
        // If it's the home page, redirect based on auth status
        if (url === '/') {
          return `${baseUrl}/profile`;
        }
        return `${baseUrl}${url}`;
      }
      
      // Handle absolute URLs within the same origin
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default fallback
      return `${baseUrl}/profile`;
    }
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);