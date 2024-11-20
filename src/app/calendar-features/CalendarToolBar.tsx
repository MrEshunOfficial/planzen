import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar as LucideCalendar,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Plus,
} from "lucide-react";
import EventForm from "./EventForm";

type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek";
type ScreenType = "mobile" | "tablet" | "desktop";

interface ResponsiveToolbarProps {
  calendarRef: React.RefObject<any>;
  selectedView: CalendarView;
  screenType: ScreenType;
  isEventDialogOpen: boolean;
  setSelectedView: (view: CalendarView) => void;
  setIsEventDialogOpen: (open: boolean) => void;
  handleCreateEvent: () => void;
}

export default function CalendarToolBar({
  calendarRef,
  selectedView,
  screenType,
  isEventDialogOpen,
  setSelectedView,
  setIsEventDialogOpen,
  handleCreateEvent,
}: ResponsiveToolbarProps) {
  const getCurrentDate = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      const date = api.getDate();
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date);
    }
    return "";
  };

  const viewOptions = [
    {
      view: "dayGridMonth" as CalendarView,
      icon: <Grid className="h-4 w-4" />,
      label: "Month",
    },
    {
      view: "timeGridWeek" as CalendarView,
      icon: <List className="h-4 w-4" />,
      label: "Week",
    },
    {
      view: "timeGridDay" as CalendarView,
      icon: <LucideCalendar className="h-4 w-4" />,
      label: "Day",
    },
    ...(screenType === "mobile"
      ? [
          {
            view: "listWeek" as CalendarView,
            icon: <List className="h-4 w-4" />,
            label: "List",
          },
        ]
      : []),
  ];

  const handleViewChange = (view: CalendarView) => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView(view);
      setSelectedView(view);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black shadow-sm rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Navigation and Current Date Section */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <Button
              onClick={() => calendarRef.current?.getApi()?.prev()}
              variant="ghost"
              size="icon"
              className="hover:bg-white dark:hover:bg-gray-600 rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => calendarRef.current?.getApi()?.next()}
              variant="ghost"
              size="icon"
              className="hover:bg-white dark:hover:bg-gray-600 rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Button
              onClick={() => calendarRef.current?.getApi()?.today()}
              variant="outline"
              className="text-sm font-medium"
            >
              Today
            </Button>
            <h2 className="text-lg font-semibold">{getCurrentDate()}</h2>
          </div>
        </div>

        {/* View Options Section */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex space-x-1">
            {viewOptions.map(({ view, icon, label }) => (
              <Button
                key={view}
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange(view)}
                className={`
                  flex items-center space-x-2 rounded-md
                  ${
                    selectedView === view
                      ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                      : "hover:bg-white dark:hover:bg-gray-600"
                  }
                `}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>

          {/* Add Event Button */}
          {screenType === "mobile" ? (
            <Drawer
              open={isEventDialogOpen}
              onOpenChange={setIsEventDialogOpen}
            >
              <DrawerTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create New Event</DrawerTitle>
                  <DrawerDescription>
                    Add a new event to your calendar
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                  <EventForm />
                </div>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog
              open={isEventDialogOpen}
              onOpenChange={setIsEventDialogOpen}
            >
              <Button
                onClick={() => setIsEventDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add a new event to your calendar
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <EventForm />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
