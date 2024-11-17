"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
  LucideIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  label?: string;
}

interface MobileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors"
    aria-label={label}
    type="button"
  >
    <Icon className="h-5 w-5 text-green-700 dark:text-green-400" />
  </button>
);

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  icon: Icon,
  label,
  onClick,
  href,
}) => {
  const content = (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors rounded-lg">
      <Icon className="h-5 w-5 text-green-700 dark:text-green-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
};

const MainHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = (): void => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={"/"}
            className="font-bold text-2xl text-green-800 dark:text-green-300 flex-shrink-0"
          >
            PlanZen
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10" // Adjust padding to account for the icon
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <IconButton
              icon={Bell}
              label="Notifications"
              onClick={() => console.log("Notifications clicked")}
            />
            <IconButton
              icon={isDarkMode ? Sun : Moon}
              label="Toggle theme"
              onClick={toggleTheme}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <IconButton icon={User} label="User menu" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => console.log("Profile clicked")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Settings clicked")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/authclient/Login"}>Sign Out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <IconButton
              icon={Search}
              onClick={toggleSearch}
              label="Toggle search"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800">
            <Input type="search" placeholder="Search..." className="w-full" />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <nav className="py-4 space-y-1">
              <MobileMenuItem
                icon={Bell}
                label="Notifications"
                onClick={() => console.log("Notifications clicked")}
              />
              <MobileMenuItem
                icon={User}
                label="Profile"
                onClick={() => console.log("Profile clicked")}
              />
              <MobileMenuItem
                icon={Settings}
                label="Settings"
                onClick={() => console.log("Settings clicked")}
              />
              <MobileMenuItem
                icon={isDarkMode ? Sun : Moon}
                label="Toggle theme"
                onClick={toggleTheme}
              />
              <MobileMenuItem
                icon={LogOut}
                label="Sign Out"
                href="/authclient/Login"
              />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
