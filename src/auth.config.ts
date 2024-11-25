import type { DefaultSession, NextAuthConfig } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export type AuthUser = {
  id: string;
  role: string;
  email: string | null;
  name: string | null;
  provider: string | null;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?: (password: string) => Promise<boolean>;
};

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

export interface CustomToken extends JWT {
  id?: string;
  role?: string;
  provider?: string;
  sessionId?: string;
}

// Define public and private paths
const publicPaths = [
  '/authclient/Register',
  '/authclient/Login',
  '/authclient/error',
  '/api/auth/callback/google',
  '/api/auth/callback/credentials',
] as const;

const privatePaths = ['/', '/profile'] as const;

// Convert arrays to Sets for better performance
const PUBLIC_PATHS = new Set<string>(publicPaths);
const PRIVATE_PATHS = new Set<string>(privatePaths);

// Normalize paths to lowercase for consistency
const normalizePath = (path: string) => path.toLowerCase();

// Helper function to check if path is a private route
const isPrivatePath = (path: string) => {
  return Array.from(PRIVATE_PATHS).some((privatePath) =>
    path.startsWith(privatePath)
  );
};

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/authclient/Login',
    signOut: '/authclient/Login',
    error: '/authclient/error',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = normalizePath(nextUrl.pathname);

      // Handle callback URLs for OAuth providers
      if (path.startsWith('/api/auth/callback/')) {
        return true;
      }

      // Handle public paths
      if (PUBLIC_PATHS.has(path)) {
        if (isLoggedIn) {
          return NextResponse.redirect(new URL('/profile', nextUrl.origin));
        }
        return true;
      }

      // Handle private paths
      if (PRIVATE_PATHS.has(path)) {
        if (!isLoggedIn) {
          const callbackUrl = encodeURIComponent(path);
          return NextResponse.redirect(
            new URL(`/authclient/Login?callbackUrl=${callbackUrl}`, nextUrl.origin)
          );
        }
        return true;
      }

      // Handle root path
      if (path === '/') {
        return isLoggedIn
          ? NextResponse.redirect(new URL('/profile', nextUrl.origin))
          : NextResponse.redirect(new URL('/authclient/Login', nextUrl.origin));
      }
      // Allow access to other paths (fallback case)
      return true;
    },
  },
  providers: [],
};
