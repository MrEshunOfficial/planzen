"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/toaster";
import { doSocialLogin } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-primary-foreground/10 rounded-full">
      {icon === "shield" ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )}
    </div>
    <span>{text}</span>
  </div>
);

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (values.rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials. Please try again.",
        });
      } else {
        router.push("/profile");
        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl bg-gradient-to-b from-background to-secondary/10 dark:from-background dark:to-secondary/5 shadow-lg dark:border-gray-800">
        <div className="w-full flex flex-col md:flex-row min-h-[600px]">
          {/* Left Panel - Branding & Social Login */}
          <aside className="md:w-2/5 bg-primary p-6 md:p-8 text-primary-foreground rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-between space-y-6 md:space-y-0">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
                <p className="text-base md:text-lg mt-2 md:mt-4 opacity-90">
                  Sign in to access your account and continue your journey with
                  us.
                </p>
              </div>

              <div className="hidden md:block space-y-4">
                <FeatureItem icon="shield" text="Secure Authentication" />
                <FeatureItem icon="users" text="Trusted by industry leaders" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <form action={doSocialLogin}>
                <Button
                  type="submit"
                  name="action"
                  value="google"
                  variant="secondary"
                  className="w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                >
                  <FcGoogle className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Sign in with Google
                </Button>
              </form>

              <div className="text-center text-sm md:text-base">
                <p className="text-primary-foreground/80">
                  {"Don't have an account? "}
                  <Link
                    href="/authclient/Register"
                    className="text-primary-foreground hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="text-xs text-primary-foreground/70 text-center">
                By signing in, you agree to our{" "}
                <Button
                  variant="link"
                  className="px-1 h-auto text-xs text-primary-foreground"
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  variant="link"
                  className="px-1 h-auto text-xs text-primary-foreground"
                >
                  Privacy Policy
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Panel - Login Form */}
          <main className="flex-1 p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <h2 className="text-xl md:text-2xl font-semibold">
                Sign in to your account
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Enter your credentials to continue
              </p>
            </CardHeader>

            <CardContent className="px-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 md:space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                          <Mail size={16} /> Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            disabled={isLoading}
                            className="h-10 md:h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                          <Lock size={16} /> Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                              disabled={isLoading}
                              className="h-10 md:h-11"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 md:h-11"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </main>
        </div>
        <Toaster />
      </Card>
    </div>
  );
}
