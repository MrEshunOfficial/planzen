"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  Calendar as CalendarIcon,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import ResponsiveCalendarPage from "./calendar-features/MainCalendarPage";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Navigation Item Type
interface NavItem {
  icon: React.ReactNode;
  label: string;
}

export default function CalendarPageWithNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState("Calendar");
  const [isMobile, setIsMobile] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Define navigation items
  const navItems: NavItem[] = [
    { icon: <CalendarIcon className="h-5 w-5" />, label: "Calendar" },
    { icon: <Users className="h-5 w-5" />, label: "Todos" },
    { icon: <Bell className="h-5 w-5" />, label: "Appointments" },
    { icon: <Settings className="h-5 w-5" />, label: "Special Events" },
  ];

  // Check screen size and set mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) {
        setIsSidebarOpen(false);
      }
    };

    // Check initial screen size
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  // Mobile Sidebar Drawer
  const MobileSidebarDrawer = () => (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 sm:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Sidebar"
        >
          <CalendarIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] p-1">
        <nav className="space-y-2 p-2 mt-8">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={activeNavItem === item.label ? "default" : "ghost"}
              className="w-full justify-start px-4"
              onClick={() => {
                setActiveNavItem(item.label);
                setIsSidebarOpen(false);
              }}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>
        <div className="mt-4 p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <main className="flex h-[88vh] w-full mt-4 relative">
      {/* Mobile Sidebar Trigger (only on mobile) */}
      {isMobile && <MobileSidebarDrawer />}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-background border-r transition-all duration-300 ease-in-out overflow-hidden flex flex-col ",
          isMobile ? "hidden" : isSidebarOpen ? "w-80" : "w-20",
          "sm:block"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && (
            <h2 className="text-lg font-semibold">Dashboard</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar"
            className="ml-auto"
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 space-y-2 p-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={activeNavItem === item.label ? "default" : "ghost"}
              className="w-full justify-start px-4"
              onClick={() => setActiveNavItem(item.label)}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* Mini Calendar */}
        {isSidebarOpen && (
          <div className="mt-6 px-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        )}
      </aside>

      {/* Main Content */}
      <section
        className={cn(
          "flex-1 flex items-center justify-center overflow-auto transition-all duration-300 ease-in-out px-4",
          isMobile
            ? "w-full"
            : isSidebarOpen
            ? "w-[calc(100%-320px)]"
            : "w-[calc(100%-80px)]"
        )}
      >
        <ResponsiveCalendarPage />
      </section>
    </main>
  );
}
