"use client";
import React, { useState } from "react";
import { UserIcon, Sun, Moon, Laptop, BellIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import Logout from "./Logout";
import { Button } from "./button";

export default function MainHeader() {
  const { setTheme } = useTheme();
  const { data: session } = useSession();

  const ThemeToggleButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="relative w-10 h-10 rounded-full">
          <Sun className="rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0 " />
          <Moon className="absolute rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-36">
        <Button
          onClick={() => setTheme("light")}
          className="flex w-full items-center justify-start gap-3 rounded-md p-2"
          variant="ghost"
        >
          <Sun className="h-5 w-5" />
          <span>Light</span>
        </Button>
        <Button
          onClick={() => setTheme("dark")}
          className="flex w-full items-center justify-start gap-3 rounded-md p-2 my-1"
          variant="ghost"
        >
          <Moon className="h-5 w-5" />
          <span>Dark</span>
        </Button>
        <Button
          onClick={() => setTheme("system")}
          className="flex w-full items-center justify-start gap-3 rounded-md p-2"
          variant="ghost"
        >
          <Laptop className="h-5 w-5" />
          <span>System</span>
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="w-full flex items-center justify-between">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        PlanZen
      </h3>

      <div className="flex items-center justify-end gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer">
              <BellIcon size={20} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="min-w-60 rounded-2xl p-1 mr-1 mt-3">
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>1st level of puns: 5 gold coins</li>
              <li>2nd level of jokes: 10 gold coins</li>
              <li>3rd level of one-liners : 20 gold coins</li>
            </ul>
          </PopoverContent>
        </Popover>
        <ThemeToggleButton />
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-start p-1 px-2 gap-3 hover:bg-secondary hover:rounded-lg transition-colors cursor-pointer">
              <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                <AvatarImage
                  src={session?.user?.image || undefined}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>
                  <UserIcon size={18} />
                </AvatarFallback>
              </Avatar>
              <p className="flex flex-col items-start text-sm">
                <span>{session?.user?.name || "Not Signed In"}</span>
                <span>{session?.user?.email || ""}</span>
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="min-w-72 rounded-2xl p-1 mr-1 -mt-16">
            <div className="flex flex-col text-sm gap-3">
              <div className="p-2 flex flex-col items-center gap-3 pb-3 border-b-2">
                <Avatar className="h-16 w-16 border border-border rounded-full shadow-md">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback>
                    <UserIcon size={18} />
                  </AvatarFallback>
                </Avatar>
                <p className="flex items-center flex-col leading-7 [&:not(:first-child)]:mt-0 text-sm p-2">
                  <span>{session?.user?.name || "Not Signed In"}</span>
                  <span>{session?.user?.email || ""}</span>
                </p>
              </div>
              <div className="pb-2 p-1 flex items-center gap-3">
                {!session ? (
                  <Button>
                    <Link href={"/authclient/Login"}>SignUp</Link>
                  </Button>
                ) : (
                  <Logout />
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
