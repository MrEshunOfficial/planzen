import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainHeader from "@/components/ui/MainHeader";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "@/components/ReduxProvider";
import UnifiedFetch from "@/components/UnifiedFetch";
import "react-datepicker/dist/react-datepicker.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Planzen",
  description: "Generated by the Planzen group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <head />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center`}
        >
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <UnifiedFetch>
                <main className="w-screen min-h-screen flex flex-col p-1">
                  {/* Fixed header on mobile, static on desktop */}
                  <header className="sm:z-50 border sm:px-4 lg:px-4 py-2 w-full p-2 sm:p-4 flex flex-col gap-6 bg-background rounded-lg">
                    <MainHeader />
                  </header>

                  {/* Main content with padding-top on mobile to account for fixed header */}
                  <section className="flex-1 w-full mt-2 sm:mt-2 h-[calc(80vh-theme(spacing.24))] sm:h-[calc(80vh-theme(spacing.28))] overflow-auto flex items-center justify-center">
                    {children}
                  </section>
                </main>
              </UnifiedFetch>
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
