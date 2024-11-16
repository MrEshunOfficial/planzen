"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./button";
import {
  Bell,
  ChevronDown,
  Mail,
  Menu,
  MoreHorizontal,
  Plus,
  ShoppingCart,
  UserIcon,
  X,
  Sun,
  Moon,
  Laptop,
  Phone,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "./input";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import Logout from "./Logout";

interface IconButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const IconButton = ({ icon: Icon, label, onClick }: IconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors"
      >
        <Icon className="text-green-700 dark:text-green-400" />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
);

export default function MainHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  console.log(session?.user?.id);

  const [mounted, setMounted] = useState(false);

  // Only show the UI after mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering of theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="bg-green-50/80 dark:bg-green-950/30 transition-colors">
        {/* Show a minimal loading state that matches both themes */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <h2 className="scroll-m-20 font-extrabold tracking-tight text-xl sm:text-2xl md:text-3xl text-green-800 dark:text-green-300">
                HarvestBridge
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ThemeToggleButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full"
        >
          <Sun className=" rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0 text-green-700 dark:text-green-400" />
          <Moon className="absolute  rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100 text-green-700 dark:text-green-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-36">
        <Button
          onClick={() => setTheme("light")}
          className="flex w-full items-center justify-start gap-3 rounded-md p-2"
          variant="ghost"
        >
          <Sun className="h-5 w-5 text-green-700 dark:text-green-400" />
          <span>Light</span>
        </Button>
        <Button
          onClick={() => setTheme("dark")}
          className="flex w-full items-center justify-start gap-3 rounded-md p-2 my-1"
          variant="ghost"
        >
          <Moon className="h-5 w-5 text-green-700 dark:text-green-400" />
          <span>Dark</span>
        </Button>
        <Button
          onClick={() => setTheme("system")}
          className="flex w-full items-center justify-start gap-3 rounded-md p-2"
          variant="ghost"
        >
          <Laptop className="h-5 w-5 text-green-700 dark:text-green-400" />
          <span>System</span>
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-green-50/80 dark:bg-green-950/30 transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h2 className="scroll-m-20 font-extrabold tracking-tight text-xl sm:text-2xl md:text-3xl text-green-800 dark:text-green-300">
              HarvestBridge
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1 px-4 lg:px-8">
            <TooltipProvider>
              <div className="flex items-center gap-1 lg:gap-3">
                <IconButton icon={ShoppingCart} label="Saved Products" />
                <IconButton icon={Bell} label="Notifications" />
                <IconButton icon={Mail} label="Open Chats" />
                <ThemeToggleButton />
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer">
                      <MoreHorizontal className="text-green-700 dark:text-green-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 rounded-2xl py-1">
                    <div className="flex flex-col text-sm">
                      <Link
                        href="#"
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900 transition-colors flex items-center justify-start gap-3 pb-3 border-b-2"
                      >
                        <Info size={18} />
                        <span> About Us</span>
                      </Link>
                      <Link
                        href="#"
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900 transition-colors flex items-center justify-start gap-3 mt-1"
                      >
                        <Phone size={18} />
                        <span>Contact Us</span>
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="User profile"
                      >
                        <Avatar className="h-10 w-10 border border-primary-500 rounded-full shadow-md">
                          <AvatarImage
                            src={session?.user?.image || undefined}
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-max rounded-2xl">
                    <div className="flex flex-col text-sm gap-3">
                      <Link
                        href={"/profile"}
                        className="w-full flex items-center justify-start gap-3"
                      >
                        <Avatar className="h-12 w-12 border border-primary-500 rounded-full shadow-md">
                          <AvatarImage
                            src={session?.user?.image || "undefined"}
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                        <p className="w-full flex flex-col leading-7 [&:not(:first-child)]:mt-0 text-sm">
                          <span>{session?.user?.name || "N/A"}</span>
                          <span>{session?.user?.email || "N/A"}</span>
                        </p>
                      </Link>
                      {!session ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex items-center justify-start gap-2"
                            >
                              <UserIcon size={18} />
                              <span>SignIn</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:min-w-max rounded-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Are you a farmer or a buyer?
                              </DialogTitle>
                              <DialogDescription>
                                Sign in to access your account, manage your{" "}
                                <br />
                                products, and chat with other farmers.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center justify-center gap-3">
                              <Button
                                type="submit"
                                className="flex-1 rounded-full flex items-center justify-center gap-3"
                              >
                                <Link href={"/authclient/Login"}>Farmer</Link>
                              </Button>
                              <Button
                                type="submit"
                                className="flex-1 rounded-full flex items-center justify-center gap-3"
                              >
                                <Link href={"/authclient/Login"}>Buyer</Link>
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Logout />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TooltipProvider>
          </div>

          {/* Sell Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="default"
              className="hidden md:flex bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
            >
              <Plus className="mr-2" /> Sell Product
            </Button>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden space-y-4 pt-4 border-t dark:border-green-800">
            <div className="grid grid-cols-5 gap-4">
              <div className="flex flex-col items-center cursor-pointer">
                <ShoppingCart className="mb-1 text-green-700 dark:text-green-400" />
                <span className="text-xs">Products</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <Bell className="mb-1 text-green-700 dark:text-green-400" />
                <span className="text-xs">Alerts</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <Mail className="mb-1 text-green-700 dark:text-green-400" />
                <span className="text-xs">Chats</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <UserIcon className="mb-1 text-green-700 dark:text-green-400" />
                <span className="text-xs">Profile</span>
              </div>
              <ThemeToggleButton />
            </div>
            <Button
              variant="default"
              className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
            >
              <Plus className="mr-2" /> Sell Product
            </Button>
          </div>
        )}

        {/* Search Bar Section */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center gap-3 rounded-full border dark:border-green-800 p-3 bg-white dark:bg-green-950 hover:bg-green-50 dark:hover:bg-green-900 w-full sm:w-auto transition-colors">
              <span>Pick Location</span>
              <ChevronDown size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Region</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>North Region</DropdownMenuItem>
              <DropdownMenuItem>South Region</DropdownMenuItem>
              <DropdownMenuItem>East Region</DropdownMenuItem>
              <DropdownMenuItem>West Region</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="text"
            className="w-full sm:w-3/4 p-4 h-11 rounded-full dark:bg-green-950 dark:border-green-800 dark:placeholder:text-green-500"
            placeholder="What agricultural products are you looking for?"
          />
        </div>
      </div>
    </div>
  );
}
