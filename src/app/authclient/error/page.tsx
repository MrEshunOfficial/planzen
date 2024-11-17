"use client";
import { doSocialLogin } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCcw, AlertCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const ErrorPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-[78vh] w-full flex flex-col md:flex-row">
      {/* Left Section */}
      <section className="w-full md:w-1/2 min-h-[40vh] md:min-h-[78vh] flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-800 p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
        <div className="w-full max-w-md space-y-4 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-300 text-center md:text-left">
            Welcome to Our Platform
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center md:text-left">
            Experience seamless authentication and unlock premium features
            designed for professionals like you.
          </p>
          <div className="space-y-3 mt-4 hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-gray-700 p-2 rounded-full shrink-0">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Advanced Security Measures
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-gray-700 p-2 rounded-full shrink-0">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Lightning-Fast Performance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-4 md:space-y-6 px-2">
          <Alert variant="destructive" className="mb-4 md:mb-6">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <div className="ml-2">
              <AlertTitle className="text-sm font-semibold">
                Authentication Error
              </AlertTitle>
              <AlertDescription className="text-sm mt-1">
                We encountered an issue while processing your request. Please
                try again.
              </AlertDescription>
            </div>
          </Alert>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center space-x-2">
              <FcGoogle className="h-6 w-6 sm:h-8 sm:w-8" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Login Failed
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {` Don't worry! This is a temporary issue. You can try refreshing the
              page or logging in with Google again.`}
            </p>
          </div>

          <div className="space-y-4">
            <form
              action={doSocialLogin}
              className="w-full"
              onSubmit={() => {
                setIsLoading((prev) => !prev);
              }}
            >
              <Button
                type="submit"
                name="action"
                value="google"
                variant="secondary"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 h-auto"
              >
                {isLoading ? (
                  <RefreshCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="text-sm sm:text-base">
                  {isLoading ? "Refreshing..." : "Try Again"}
                </span>
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex items-center text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline p-2"
              >
                <Home className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Home
              </Link>
              <Link
                href="/support"
                className="flex items-center text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline p-2"
              >
                <AlertCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Contact Support
              </Link>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              If the issue persists, please contact our support team or try
              again later.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
