import type { NextAuthConfig } from 'next-auth';
import { User as DbUser } from "@/models/authentication/authModel";

export type AuthUser = {
  id: string;
  role: string;
  email: string | null;
  image: string | null;
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
      id: string;
      role: string;
      email: string | null;
      image: string | null;
      name: string | null;
      provider: string | null;
      providerId: string | null;
      createdAt: Date;
      updatedAt: Date;
    }
    sessionId: string;
  }

  interface User extends AuthUser {}

  interface JWT {
    id: string;
    role: string;
    provider?: string;
    sessionId: string;
  }
}

// Define public and private paths
const publicPaths = [
  '/authclient/Register',
  '/authclient/Login',
  '/authclient/error',
  '/api/auth/callback/google',
  '/api/auth/callback/credentials'
] as const;

const privatePaths = ['/profile', '/'] as const;

// Convert array to Set for better performance
const PUBLIC_PATHS = new Set<string>(publicPaths);
const PRIVATE_PATHS = new Set<string>(privatePaths);

// Helper function to check if path starts with any private path
const isPrivatePath = (path: string) => {
  return Array.from(PRIVATE_PATHS).some(privatePath => 
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Handle callback URLs for OAuth providers
      if (path.startsWith('/api/auth/callback/')) {
        return true;
      }

      // Handle public paths
      if (PUBLIC_PATHS.has(path)) {
        // Redirect to profile if already logged in
        if (isLoggedIn) {
          return Response.redirect(new URL('/profile', nextUrl));
        }
        return true;
      }

      // Handle private paths
      if (isPrivatePath(path)) {
        if (!isLoggedIn) {
          const callbackUrl = encodeURIComponent(path);
          return Response.redirect(
            new URL(`/authclient/Login?callbackUrl=${callbackUrl}`, nextUrl)
          );
        }
        return true;
      }

      // Handle root path
      if (path === '/') {
        return isLoggedIn
          ? Response.redirect(new URL('/profile', nextUrl))
          : Response.redirect(new URL('/authclient/Login', nextUrl));
      }

      // Allow access to all other paths
      return true;
    },
  },
  providers: [], // Providers will be configured in auth.ts
};