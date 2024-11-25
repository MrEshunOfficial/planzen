// client-layout.tsx
"use client";

import MainHeader from "@/components/ui/MainHeader";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "@/components/ReduxProvider";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Public paths that don't need UnifiedFetch
const publicPaths = [
  "/authclient/Register",
  "/authclient/Login",
  "/authclient/error",
  "/api/auth/callback/google",
  "/api/auth/callback/credentials",
];

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

  // For public paths, render without UnifiedFetch
  if (isPublicPath) {
    return (
      <main className="w-screen min-h-screen flex flex-col p-1">
        <section className="flex-1 w-full mt-2 sm:mt-2 h-[calc(80vh-theme(spacing.24))] sm:h-[calc(80vh-theme(spacing.28))] overflow-auto flex items-center justify-center">
          {children}
        </section>
      </main>
    );
  }

  // For protected paths, include header and UnifiedFetch
  const UnifiedFetch = dynamic(() => import("@/components/UnifiedFetch"), {
    ssr: false,
  });

  return (
    <UnifiedFetch>
      <main className="w-screen min-h-screen flex flex-col p-1">
        <header className="sm:z-50 border sm:px-4 lg:px-4 py-2 w-full p-2 sm:p-4 flex flex-col gap-6 bg-background rounded-lg">
          <MainHeader />
        </header>
        <section className="flex-1 w-full mt-2 sm:mt-2 h-[calc(80vh-theme(spacing.24))] sm:h-[calc(80vh-theme(spacing.28))] overflow-auto flex items-center justify-center">
          {children}
        </section>
      </main>
    </UnifiedFetch>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
