"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CalendarPage from "./calendar-features/CalendarPage";
import TaskListPage from "./calendar-features/TaskListPage";
import CalendarToolBar from "./calendar-features/CalendarToolBar";
import { CalendarView, ViewMode } from "@/store/event.types";
import { ChevronRight, Menu } from "lucide-react";
import AsideContent from "./calendar-features/AsideContent";

// Constants for localStorage keys
const VIEW_MODE_KEY = "calendar_view_mode";
const CALENDAR_VIEW_KEY = "calendar_selected_view";

export default function HomePage() {
  // Initialize state with values from localStorage or defaults
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem(VIEW_MODE_KEY);
      return (savedMode as ViewMode) || "calendar";
    }
    return "calendar";
  });

  const [selectedView, setSelectedView] = useState<CalendarView>(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem(CALENDAR_VIEW_KEY);
      return (savedView as CalendarView) || "timeGridWeek";
    }
    return "timeGridWeek";
  });

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Calendar reference
  const calendarRef = useRef(null);

  // Screen type detection
  const getScreenType = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    }
    return "desktop";
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Persist view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  // Persist calendar view changes
  const handleSelectedViewChange = (view: CalendarView) => {
    setSelectedView(view);
    localStorage.setItem(CALENDAR_VIEW_KEY, view);
  };

  // Handle event creation
  const handleCreateEvent = () => {
    setIsEventDialogOpen(true);
  };

  return (
    <div className="flex h-[90vh] w-full overflow-hidden mt-4">
      <main className="flex-1 flex flex-col md:flex-row gap-2 p-2 overflow-hidden">
        {/* Mobile Drawer */}
        {isMobile ? (
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mb-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <AsideContent />
            </SheetContent>
          </Sheet>
        ) : (
          /* Desktop Sidebar */
          <aside className="hidden md:block md:w-80 lg:w-96 border rounded-lg p-2 overflow-y-auto">
            <AsideContent />
          </aside>
        )}

        {/* Main Content */}
        <section className="flex-1 flex flex-col gap-2 border rounded-lg p-2 min-h-0 overflow-hidden">
          <header className="flex-shrink-0">
            <CalendarToolBar
              calendarRef={calendarRef}
              selectedView={selectedView}
              screenType={getScreenType()}
              isEventDialogOpen={isEventDialogOpen}
              viewMode={viewMode}
              setSelectedView={handleSelectedViewChange}
              setIsEventDialogOpen={setIsEventDialogOpen}
              setViewMode={handleViewModeChange}
              handleCreateEvent={handleCreateEvent}
            />
          </header>
          <section className="flex-1 min-h-0 border rounded-lg overflow-hidden">
            {viewMode === "calendar" ? (
              <CalendarPage calendarRef={calendarRef} />
            ) : (
              <TaskListPage />
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
