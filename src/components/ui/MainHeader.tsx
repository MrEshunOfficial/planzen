"use client";
import React, { useEffect, useState } from "react";
import {
  UserIcon,
  Sun,
  Moon,
  Laptop,
  BellIcon,
  Menu,
  Settings,
  User,
  Bell,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import Logout from "./Logout";
import { Button, buttonVariants } from "./button";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface ThemeToggleButtonProps {
  setTheme: (theme: string) => void;
}

interface UserMenuProps {
  session: any; // Replace with actual NextAuth session type
  onClose?: () => void;
}

interface MainHeaderProps {
  className?: string;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ setTheme }) => {
  const { theme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="relative w-8 h-8 md:w-10 md:h-10 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36">
              <div className="flex flex-col gap-1">
                {["light", "dark", "system"].map((themeOption) => (
                  <Button
                    key={themeOption}
                    onClick={() => setTheme(themeOption)}
                    className={cn(
                      "flex w-full items-center justify-start gap-3 p-2 capitalize",
                      theme === themeOption && "bg-secondary"
                    )}
                    variant="ghost"
                  >
                    {themeOption === "light" && <Sun className="h-4 w-4" />}
                    {themeOption === "dark" && <Moon className="h-4 w-4" />}
                    {themeOption === "system" && <Laptop className="h-4 w-4" />}
                    <span>{themeOption}</span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const UserMenu: React.FC<UserMenuProps> = ({ session, onClose }) => {
  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex flex-col text-sm gap-3">
      <div className="p-2 flex flex-col items-center gap-3 pb-3 border-b">
        <Avatar className="h-16 w-16 border border-border rounded-full shadow-md transition-transform hover:scale-105">
          <AvatarImage
            src={session?.user?.image}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback>
            <UserIcon size={18} />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center flex-col leading-7 text-sm">
          <span className="font-medium">
            {session?.user?.name || "Not Signed In"}
          </span>
          <span className="text-xs text-muted-foreground">
            {session?.user?.email || ""}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-1 flex justify-center">
        {!session ? (
          <Button asChild>
            <Link href="/authclient/Login" onClick={onClose}>
              Sign Up
            </Link>
          </Button>
        ) : (
          <Logout />
        )}
      </div>
    </div>
  );
};

const NotificationsMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Achievement",
      description: "1st level of puns: 5 gold coins",
      timestamp: "2m ago",
      read: false,
    },
    {
      id: "2",
      title: "Level Up",
      description: "2nd level of jokes: 10 gold coins",
      timestamp: "1h ago",
      read: true,
    },
    {
      id: "3",
      title: "New Reward",
      description: "3rd level of one-liners: 20 gold coins",
      timestamp: "2h ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between pb-4 border-b">
        <h4 className="text-sm font-medium">Notifications</h4>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs">
            Mark all as read
          </Button>
        )}
      </div>
      <div className="space-y-4 mt-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex gap-3 p-2 rounded-lg transition-colors",
              !notification.read && "bg-muted",
              "hover:bg-muted/60 cursor-pointer"
            )}
            onClick={() => markAsRead(notification.id)}
          >
            <Bell
              className={cn(
                "h-5 w-5 mt-1",
                !notification.read && "text-primary"
              )}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.title}</p>
                <span className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainHeader: React.FC<MainHeaderProps> = ({ className }) => {
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sm:fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2",
        isScrolled && "shadow-sm",
        className
      )}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.h3
            className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PlanZen
          </motion.h3>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
          {/* Notifications - Hidden on mobile */}
          <div className="hidden md:block">
            <Popover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full relative"
                      >
                        <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                          2
                        </span>
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent align="end" className="w-80">
                <NotificationsMenu />
              </PopoverContent>
            </Popover>
          </div>

          {/* Theme Toggle */}
          <ThemeToggleButton setTheme={setTheme} />

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 h-10 transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-border rounded-full transition-transform hover:scale-105">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      <UserIcon size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[150px] truncate">
                    {session?.user?.name || "Sign In"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <UserMenu session={session} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 py-4">
                  {/* Mobile Notifications */}
                  <NotificationsMenu />

                  {/* Mobile User Menu */}
                  <div className="mt-4">
                    <SheetClose asChild>
                      <UserMenu session={session} onClose={() => {}} />
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default MainHeader;
