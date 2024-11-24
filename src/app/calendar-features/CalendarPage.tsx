import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { RootState } from "@/store";
import { setSelectedEvent, deleteEvent } from "@/store/event.slice";
import CalendarEvent from "./CalendarEvent";
import { CalendarCustomStyles } from "./CalendarCustomStyles";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Share2,
  Printer,
  Settings,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IEvent } from "@/store/event.slice";

interface CalendarPageProps {
  calendarRef: React.RefObject<any>;
  onEditEvent?: (eventId: string) => void;
}

export default function CalendarPage({
  calendarRef,
  onEditEvent,
}: CalendarPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredEvents, loading, error, selectedEventId } = useSelector(
    (state: RootState) => state.events
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Determine calendar view based on screen size
  const getInitialView = useCallback(() => {
    if (windowWidth < 640) {
      return "listWeek";
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

  // Find selected event details with proper typing
  const selectedEvent = filteredEvents.find(
    (event: IEvent) => event._id === selectedEventId
  );

  const handleEventClick = (arg: EventClickArg) => {
    const eventId = arg.event.extendedProps._id;
    setCurrentEvent(arg.event.extendedProps);
    dispatch(setSelectedEvent(eventId));
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      dispatch(deleteEvent(selectedEvent._id));
      setIsDialogOpen(false);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent && onEditEvent) {
      onEditEvent(selectedEvent._id);
    }
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

  const renderEventDetails = () => {
    const eventToRender = currentEvent || selectedEvent;
    if (!eventToRender) return null;

    const formatEventTime = (time: Date | undefined | null) => {
      return time ? format(new Date(time), "h:mm a") : "";
    };

    return (
      <div className="space-y-4">
        <div className="mt-4">
          <h3 className="font-medium mb-2">Time</h3>
          <p className="text-sm">
            {eventToRender.isAllDayEvent
              ? "All Day"
              : `${formatEventTime(
                  eventToRender.startTime
                )} - ${formatEventTime(eventToRender.endTime)}`}
          </p>
        </div>

        {eventToRender.todoData && (
          <div className="break-words">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm">{eventToRender.todoData.description}</p>
            {eventToRender.todoData.links?.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium mb-1">Links</h4>
                <ul className="text-sm space-y-1">
                  {eventToRender.todoData.links.map(
                    (link: string, index: number) => (
                      <li key={index} className="break-all">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <CalendarCustomStyles />
      <div className="h-full overflow-hidden">
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

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <AlertDialogTitle className="text-xl font-semibold break-words">
                  {currentEvent?.title || selectedEvent?.title}
                </AlertDialogTitle>
                {(currentEvent?.type || selectedEvent?.type) && (
                  <Badge variant="outline" className="mt-2">
                    {(currentEvent?.type || selectedEvent?.type).replace(
                      "-",
                      " "
                    )}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
                className="h-6 w-6 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="max-h-[50vh] overflow-y-auto">
            {renderEventDetails()}
          </AlertDialogDescription>

          <AlertDialogFooter className="sm:space-x-2">
            {windowWidth < 640 ? (
              <div className="w-full space-y-2">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowActionMenu(!showActionMenu)}
                    className="gap-2"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    Actions
                  </Button>
                </div>
                {showActionMenu && (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Sharing...");
                        setShowActionMenu(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Printing...");
                        setShowActionMenu(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteEvent}
                      className="w-full justify-start gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleEditEvent}
                      className="w-full justify-start gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Sharing...")}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Printing...")}
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Customizing...")}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Customize
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteEvent}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEditEvent}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
