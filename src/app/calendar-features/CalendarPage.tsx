import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import CalendarEvent from "./CalendarEvent";
import { CalendarCustomStyles } from "./CalendarCustomStyles";
import { IEvent, setSelectedEvent } from "@/store/event.slice";
import { AppDispatch, RootState } from "@/store";
import EventDialog from "./EventDialog";

interface CalendarPageProps {
  calendarRef: React.RefObject<any>;
  onEditEvent?: (eventId: string) => void;
}

export default function CalendarPage({
  calendarRef,
  onEditEvent,
}: CalendarPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredEvents, selectedEventId } = useSelector(
    (state: RootState) => state.events
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Determine calendar view based on screen size
  const getInitialView = useCallback(() => {
    if (windowWidth < 640) {
      return "timeGridDay";
    } else if (windowWidth < 1024) {
      return "timeGridDay";
    }
    return "timeGridWeek";
  }, [windowWidth]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(getInitialView());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calendarRef, getInitialView]);

  const handleEventClick = (arg: EventClickArg) => {
    const eventId = arg.event.extendedProps._id;
    setCurrentEvent(arg.event.extendedProps);
    dispatch(setSelectedEvent(eventId));
    setIsDialogOpen(true);
  };

  const renderEventContent = (eventInfo: any) => {
    const event = eventInfo.event;
    const eventData: IEvent = {
      _id: event.extendedProps._id,
      title: event.title,
      type: event.extendedProps.type,
      date: event.start,
      startTime: event.start,
      endTime: event.end,
      isAllDayEvent: event.allDay,
      todoData: event.extendedProps.todoData,
      routineData: event.extendedProps.routineData,
      specialEventData: event.extendedProps.specialEventData,
      appointmentData: event.extendedProps.appointmentData,
      reminders: event.extendedProps.reminders,
      userId: event.extendedProps.userId,
    };

    return <CalendarEvent {...eventData} className="h-full" />;
  };

  return (
    <div className="flex flex-col h-[calc(98vh-12rem)] sm:h-[calc(98vh-14rem)]">
      <CalendarCustomStyles />
      <div className="flex-1 min-h-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView={getInitialView()}
          headerToolbar={false}
          footerToolbar={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          moreLinkClick="day"
          weekends={true}
          events={filteredEvents}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          height="100%"
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={true}
          slotDuration="00:30:00"
          slotLabelInterval="01:00"
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          views={{
            timeGridWeek: {
              titleFormat: { year: "numeric", month: "long" },
              dayHeaderFormat: {
                weekday: "short",
                month: "numeric",
                day: "numeric",
                omitCommas: true,
              },
            },
            timeGridDay: {
              titleFormat: { year: "numeric", month: "long", day: "numeric" },
            },
            dayGridMonth: {
              titleFormat: { year: "numeric", month: "long" },
            },
            listWeek: {
              titleFormat: { year: "numeric", month: "long" },
              listDayFormat: { weekday: "long", month: "long", day: "numeric" },
              listDaySideFormat: false,
            },
          }}
        />
      </div>

      <EventDialog
        isOpen={!!selectedEventId}
        onClose={() => dispatch(setSelectedEvent(null))}
        onEdit={onEditEvent}
      />
    </div>
  );
}
