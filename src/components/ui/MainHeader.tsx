"use client";
import React, { useState } from "react";
import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
  LucideIcon,
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
}) => (
  <div className="flex flex-col items-center">
    <IconButton icon={Icon} onClick={onClick} label={label} />
    <span className="text-xs mt-1">{label}</span>
  </div>
);

const MainHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-50/80 dark:bg-gray-950/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={"/"}
            className="font-bold text-2xl text-green-800 dark:text-green-300"
          >
            PlanZen
          </Link>

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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <MobileMenuItem
                icon={Bell}
                label="Notifications"
                onClick={() => console.log("Notifications clicked")}
              />
              <MobileMenuItem
                icon={isDarkMode ? Sun : Moon}
                label="Theme"
                onClick={toggleTheme}
              />
              <MobileMenuItem
                icon={User}
                label="Profile"
                onClick={() => console.log("Profile clicked")}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
