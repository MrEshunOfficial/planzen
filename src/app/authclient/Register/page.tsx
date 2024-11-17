"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { doSocialLogin } from "@/app/actions";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Function implementations remain the same
  const generatePasswordSuggestion = async () => {
    setIsGeneratingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const password = Math.random().toString(36).slice(-10) + "A1!";
      form.setValue("password", password);
      form.setValue("confirmPassword", password);
      setShowPassword(true);
      setShowConfirmPassword(true);
    } catch (error) {
      console.error("Password generation failed:", error);
      toast({
        title: "Password Generation Failed",
        description:
          "Failed to generate a password suggestion. Please try again.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPassword(false);
    }
  };
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully.",
          duration: 5000,
        });
        router.push("/authclient/Login");
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description:
            errorData.message || "An error occurred during registration.",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again later.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl bg-gradient-to-b from-background to-secondary/10 dark:from-background dark:to-secondary/5 shadow-lg dark:border-gray-800">
        <div className="w-full flex flex-col md:flex-row min-h-[600px]">
          {/* Left Panel - Branding & Social Login */}
          <aside className="md:w-2/5 bg-primary p-6 md:p-8 text-primary-foreground rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-between space-y-6 md:space-y-0">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome to Planzen
                </h1>
                <p className="text-base md:text-lg mt-2 md:mt-4 opacity-90">
                  Join thousands of professionals who trust our enterprise
                  solutions.
                </p>
              </div>

              <div className="hidden md:block space-y-4">
                <FeatureItem icon="shield" text="Enterprise-grade security" />
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
                  Sign up with Google
                </Button>
              </form>

              <div className="text-center text-sm md:text-base">
                <p className="text-primary-foreground/80">
                  Already have an account?{" "}
                  <Link
                    href="/authclient/Login"
                    className="text-primary-foreground hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="text-xs text-primary-foreground/70 text-center">
                By creating an account, you agree to our{" "}
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

          {/* Right Panel - Sign Up Form */}
          <main className="flex-1 p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <h2 className="text-xl md:text-2xl font-semibold">
                Create your account
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Enter your details to get started
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                          <UserIcon size={16} /> Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                          <Mail size={16} /> Business Email
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

                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePasswordSuggestion}
                      disabled={isGeneratingPassword || isLoading}
                      className="w-full h-10 md:h-11"
                    >
                      {isGeneratingPassword ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Generate Secure Password
                    </Button>

                    <PasswordField
                      form={form}
                      name="password"
                      label="Password"
                      show={showPassword}
                      setShow={setShowPassword}
                      isLoading={isLoading}
                    />

                    <PasswordField
                      form={form}
                      name="confirmPassword"
                      label="Confirm Password"
                      show={showConfirmPassword}
                      setShow={setShowConfirmPassword}
                      isLoading={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
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

// Helper Components
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

const PasswordField = ({
  form,
  name,
  label,
  show,
  setShow,
  isLoading,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  name: "password" | "confirmPassword";
  label: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center gap-2 text-sm md:text-base">
          <Lock size={16} /> {label}
        </FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              {...field}
              disabled={isLoading}
              className="h-10 md:h-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 md:h-11"
              onClick={() => setShow(!show)}
              disabled={isLoading}
            >
              {show ? (
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
);
