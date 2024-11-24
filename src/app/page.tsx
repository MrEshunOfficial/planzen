"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import CalendarPage from "./calendar-features/CalendarPage";
import TaskListPage from "./calendar-features/TaskListPage";
import CalendarToolBar from "./calendar-features/CalendarToolBar";
import { ViewMode, CalendarView } from "@/store/event.types";

export default function HomePage() {
  // State management
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedView, setSelectedView] =
    useState<CalendarView>("timeGridWeek");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

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

  // Handle event creation
  const handleCreateEvent = () => {
    setIsEventDialogOpen(true);
  };

  return (
    <div className="h-auto w-full flex items-center justify-center mt-2">
      <main className="w-full min-h-[90vh] p-2 flex flex-col md:flex-row items-stretch gap-2">
        {/* Mobile Navigation Toggle Button */}
        <Button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden w-full mb-2"
        >
          {isNavOpen ? "Hide Calendar Sidebar" : "Show Calendar Sidebar"}
        </Button>

        {/* Sidebar */}
        <aside
          className={`
            transition-all duration-300 ease-in-out
            ${isNavOpen ? "h-64 md:h-full" : "h-0 md:h-full"}
            ${isNavOpen ? "opacity-100" : "opacity-0 md:opacity-100"}
            ${isNavOpen ? "mb-2 md:mb-0" : "mb-0"}
            overflow-hidden
            md:block md:w-80 lg:w-96
            border rounded-lg p-2
          `}
        >
          calendar aside
        </aside>

        {/* Main Content */}
        <section className="flex-1 min-h-0 flex flex-col gap-2 border rounded-lg p-2">
          <header className="w-full p-1 rounded-lg">
            <CalendarToolBar
              calendarRef={calendarRef}
              selectedView={selectedView}
              screenType={getScreenType()}
              isEventDialogOpen={isEventDialogOpen}
              viewMode={viewMode}
              setSelectedView={setSelectedView}
              setIsEventDialogOpen={setIsEventDialogOpen}
              setViewMode={setViewMode}
              handleCreateEvent={handleCreateEvent}
            />
          </header>
          <section className="w-full flex-1 min-h-0 p-1 border rounded-lg overflow-auto">
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
