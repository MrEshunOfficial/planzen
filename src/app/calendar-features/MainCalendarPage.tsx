import React, { useState, useRef, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import {
  CalendarOptions,
  EventInput,
  EventDropArg,
  EventContentArg,
  EventClickArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { cn } from "@/lib/utils";
import CalendarToolBar from "./CalendarToolBar";
import CalendarEvent from "./CalendarEvent";
import EventDialog from "./EventDialog";
import { CalendarCustomStyles } from "./CalendarCustomStyles";

interface CalendarEvent extends EventInput {
  id?: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  location?: string;
  attendees?: number;
  status?: "upcoming" | "in-progress" | "completed";
}

type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek";

export default function MainCalendarPage() {
  const today = new Date();
  const tomorrow = new Date(today);

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      start: today.toISOString(),
      end: tomorrow.toISOString(),
      allDay: false,
      location: "Conference Room",
      attendees: 5,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Product Launch",
      start: tomorrow.toISOString(),
      end: new Date(tomorrow.getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
      allDay: false,
      location: "Office",
      attendees: 10,
      status: "upcoming",
    },
  ]);

  const [screenType, setScreenType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedView, setSelectedView] =
    useState<CalendarView>("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenType("mobile");
      } else if (width < 1024) {
        setScreenType("tablet");
      } else {
        setScreenType("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const calendarOptions = useMemo<CalendarOptions>(() => {
    const renderEvent = (eventInfo: EventContentArg) => {
      const { event } = eventInfo;
      return (
        <CalendarEvent
          title={event.title}
          start={event.startStr}
          end={event.endStr}
          location={event.extendedProps.location}
          attendees={event.extendedProps.attendees}
          status={event.extendedProps.status || "upcoming"}
          isAllDay={event.allDay}
          className={cn(
            selectedView === "dayGridMonth" && "text-xs",
            selectedView.includes("timeGrid") && "text-sm",
            screenType === "mobile" ? "p-1" : "p-2"
          )}
        />
      );
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
      const { event } = clickInfo;
      setSelectedEvent({
        id: event.id,
        title: event.title,
        start: event.startStr,
        end: event.endStr,
        allDay: event.allDay,
        location: event.extendedProps.location,
        attendees: event.extendedProps.attendees,
        status: event.extendedProps.status,
      });
      setIsEventDialogOpen(true);
    };

    const handleEventDrop = (dropInfo: EventDropArg) => {
      const updatedEvent: CalendarEvent = {
        ...events.find((e) => e.id === dropInfo.event.id)!,
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr,
        title: dropInfo.event.title,
        allDay: dropInfo.event.allDay,
        extendedProps: dropInfo.event.extendedProps,
      };

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    };

    const baseOptions: CalendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: selectedView,
      headerToolbar: false,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: events,
      eventContent: renderEvent,
      eventClick: handleEventClick,
      eventDrop: handleEventDrop,
    };

    // Responsive adjustments
    switch (screenType) {
      case "mobile":
        return {
          ...baseOptions,
          height: "100%",
          contentHeight: "auto",
          aspectRatio: 0.8,
          views: {
            dayGridMonth: { type: "dayGridMonth", duration: { months: 1 } },
            timeGridWeek: { type: "timeGridWeek", duration: { weeks: 1 } },
            timeGridDay: { type: "timeGridDay", duration: { days: 1 } },
            listWeek: { type: "listWeek", duration: { weeks: 1 } },
          },
        };
      case "tablet":
        return {
          ...baseOptions,
          height: "100%",
          aspectRatio: 1.35,
        };
      default:
        return {
          ...baseOptions,
          height: "100%",
          aspectRatio: 1.75,
        };
    }
  }, [screenType, selectedView, events]); // Dependencies are now properly handled

  // Event Handlers
  const handleCreateEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: "New Event",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      status: "upcoming",
      location: "Meeting Room 1",
      attendees: 3,
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsEventDialogOpen(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <CalendarCustomStyles />
      <CalendarToolBar
        calendarRef={calendarRef}
        selectedView={selectedView}
        screenType={screenType}
        isEventDialogOpen={isEventDialogOpen}
        setSelectedView={setSelectedView}
        setIsEventDialogOpen={setIsEventDialogOpen}
        handleCreateEvent={handleCreateEvent}
      />
      <div
        className={cn(
          "flex-1 w-full overflow-hidden",
          "transition-all duration-300 ease-in-out",
          "text-xs sm:text-sm lg:text-base"
        )}
      >
        <FullCalendar ref={calendarRef} {...calendarOptions} />
      </div>

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
}
