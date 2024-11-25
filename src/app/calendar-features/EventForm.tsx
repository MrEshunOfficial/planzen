"use client";
import { CardContent } from "@/components/ui/card";
import { TabsContent, TabsList } from "@/components/ui/tabs";
import { Tabs, TabsTrigger } from "@radix-ui/react-tabs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateTimeComponent, EventRepeatSelection } from "./DatesAndReminders";
import { AppointmentData, AppointmentForm } from "./AppointmentForm";
import { ReminderComponent } from "./EventReminder";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  IRepeat,
  EventType,
  Priority,
  RepeatType,
  IRepeatConfig,
  EndRepeatOption,
  IReminder,
  AppointmentType,
} from "@/store/event.types";
import { AppDispatch } from "@/store";
import { createEvent, IEvent } from "@/store/event.slice";
import { SpecialEventData, SpecialEventsForm } from "./SpecialEventsForm";
import { TodoForm } from "./TodoForm";
import { RoutineForm } from "./RoutineForm";

export default function EventForm() {
  const [activeTab, setActiveTab] = useState<
    "todo" | "routine" | "special-event" | "appointment"
  >("todo");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [isAllDayEvent, setIsAllDayEvent] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminders, setReminders] = useState<IReminder[]>([]);
  const [title, setTitle] = useState<string>("");

  const [selectedRepeat, setSelectedRepeat] = useState<RepeatType>(
    RepeatType.NO_REPEAT
  );

  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [customRepeatConfig, setCustomRepeatConfig] = useState<IRepeatConfig>({
    repeatPattern: "daily",
    repeatFrequency: 1,
    selectedDays: [],
    endRepeatOption: EndRepeatOption.NEVER,
    endDate: null,
    occurrences: 10,
    repeatMonth: 1,
    monthDate: null,
  });

  const [todoData, setTodoData] = useState<{
    description?: string;
    priority?: string;
    tags?: string;
    links?: string[];
  }>({
    description: "",
    priority: "medium",
    tags: "",
    links: [],
  });

  const [routineData, setRoutineData] = useState({
    routineNotes: "",
    priority: Priority.MEDIUM,
    label: "",
  });

  const [specialEventData, setSpecialEventData] = useState<SpecialEventData>({
    eventName: "",
    location: "",
    attendees: 0,
    budget: 0,
  });

  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    venue: "",
    appointmentDate: new Date().toISOString(), // Initialize with current date
    contactNumber: "",
    appointmentType: "consultation" as AppointmentType,
    appointmentLinks: [],
    additionalNotes: "",
  });

  const handleReminderSave = (reminder: IReminder) => {
    setReminders((prev) => [...prev, reminder]);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to create events");
      return;
    }

    if (!title) {
      alert("Please add a title to the event");
      return;
    }

    // Validate routine data
    if (
      activeTab === "routine" &&
      (!routineData.label || !routineData.routineNotes)
    ) {
      alert("Please fill in all routine fields");
      return;
    }

    // Validate appointment data
    if (activeTab === "appointment") {
      if (!appointmentData.venue || !appointmentData.contactNumber) {
        alert("Please fill in all required appointment fields");
        return;
      }
    }

    const repeatConfig: IRepeat | undefined =
      selectedRepeat === RepeatType.NO_REPEAT
        ? undefined
        : {
            type: selectedRepeat,
            config: {
              ...customRepeatConfig,
              selectedDays:
                selectedRepeat === RepeatType.WEEKLY
                  ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                  : customRepeatConfig.selectedDays,
              repeatMonth:
                selectedRepeat === RepeatType.WEEKLY
                  ? 1
                  : customRepeatConfig.repeatMonth,
              monthDate:
                selectedRepeat === RepeatType.WEEKLY
                  ? null
                  : customRepeatConfig.monthDate,
            },
          };

    // Create event data based on active tab
    const eventData: Partial<IEvent> = {
      userId,
      title,
      type: activeTab as EventType,
      date: selectedDate!,
      startTime: isAllDayEvent ? undefined : startTime,
      endTime: isAllDayEvent ? undefined : endTime,
      isAllDayEvent,
      reminders,
      repeat: repeatConfig,
    };

    // Add specific data based on event type
    switch (activeTab) {
      case "todo":
        eventData.todoData = {
          description: todoData.description || "",
          priority: (todoData.priority as Priority) || "medium",
          tags: todoData?.tags?.split(",").map((tag) => tag.trim()),
          links: todoData.links || [],
        };
        break;

      case "routine":
        eventData.routineData = {
          routineNotes: routineData.routineNotes,
          priority: routineData.priority as Priority,
          label: routineData.label,
        };
        break;

      case "special-event":
        eventData.specialEventData = {
          eventName: specialEventData.eventName,
          location: specialEventData.location,
          attendees: specialEventData.attendees,
          budget: specialEventData.budget,
        };
        break;

      case "appointment":
        eventData.appointmentData = {
          venue: appointmentData.venue,
          appointmentDate: appointmentData.appointmentDate,
          contactNumber: appointmentData.contactNumber,
          appointmentType: appointmentData.appointmentType,
          appointmentLinks: appointmentData.appointmentLinks || [],
          additionalNotes: appointmentData.additionalNotes || "",
        };
        break;
    }

    try {
      await dispatch(createEvent(eventData)).unwrap();
      resetForm();
      alert("Event created successfully!");
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setSelectedDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setIsAllDayEvent(false);
    setReminders([]);
    setTodoData({
      description: "",
      priority: "medium",
      tags: "",
      links: [],
    });
    setRoutineData({
      routineNotes: "",
      priority: Priority.MEDIUM,
      label: "",
    });
    setSpecialEventData({
      eventName: "",
      location: "",
      attendees: 0,
      budget: 0,
    });
    setAppointmentData({
      venue: "",
      appointmentDate: new Date().toISOString(),
      contactNumber: "",
      appointmentType: AppointmentType.CONSULTATION,
      appointmentLinks: [],
      additionalNotes: "",
    });
  };

  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-2 overflow-auto"
    >
      <input
        type="text"
        placeholder="Add Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl border-b border-gray-300 dark:border-gray-800 indent-2 focus:outline-none"
      />
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(
            value as "todo" | "routine" | "special-event" | "appointment"
          )
        }
        className="relative"
      >
        <TabsList
          className="w-full flex justify-center items-center 
          bg-gray-100 dark:bg-gray-800 
          p-0 rounded-lg 
          border border-gray-200 dark:border-gray-700 
          shadow-sm hover:shadow-md 
          transition-all duration-300"
        >
          {[
            { value: "todo", label: "Todo" },
            { value: "routine", label: "Routine" },
            { value: "special-event", label: "Special Event" },
            { value: "appointment", label: "Appointment" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="
                flex-1 
                p-2
                text-xs sm:text-sm 
                text-gray-600 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-700
                data-[state=active]:bg-blue-500 
                data-[state=active]:text-white
                rounded-md
                transition-colors 
                duration-200 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-400
              "
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="w-full flex flex-col gap-2">
          <DateTimeComponent
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            isAllDayEvent={isAllDayEvent}
          />

          <EventRepeatSelection
            setIsAllDayEvent={setIsAllDayEvent}
            selectedRepeat={selectedRepeat}
            setSelectedRepeat={setSelectedRepeat}
            customRepeatConfig={customRepeatConfig}
            setCustomRepeatConfig={setCustomRepeatConfig}
          />
        </div>
        <TabsContent value="todo" className="space-y-4">
          <CardContent className="p-1 border rounded-md my-1">
            <TodoForm
              data={todoData}
              onUpdate={(updatedData) => setTodoData(updatedData)}
            />
          </CardContent>
        </TabsContent>
        <TabsContent value="routine" className="space-y-4">
          <CardContent className="p-1 border rounded-md">
            <RoutineForm
              initialData={routineData}
              onSubmit={(data) => setRoutineData(data)}
            />
          </CardContent>
        </TabsContent>
        <TabsContent value="special-event" className="space-y-4">
          <CardContent className="p-1 border rounded-md">
            <SpecialEventsForm
              data={specialEventData}
              onUpdate={setSpecialEventData}
            />
          </CardContent>
        </TabsContent>
        <TabsContent value="appointment" className="space-y-4">
          <CardContent className="p-1 border rounded-md">
            <AppointmentForm
              data={appointmentData}
              onUpdate={setAppointmentData}
            />
          </CardContent>
        </TabsContent>
        <ReminderComponent
          open={isReminderOpen}
          onClose={() => {}}
          onOpenChange={setIsReminderOpen}
          onReminderSave={handleReminderSave}
          eventType={activeTab}
          eventTitle={title}
          eventDate={selectedDate || undefined}
          eventTime={startTime || undefined}
          eventData={{
            priority: todoData.priority,
            appointmentType: appointmentData.appointmentType,
            budget: specialEventData.budget,
            attendees: specialEventData.attendees,
          }}
        />

        <Button
          type="submit"
          variant={"default"}
          className="w-full mt-2 flex items-center justify-center gap-2"
        >
          {isLoading
            ? "Creating event..."
            : activeTab === "todo"
            ? "Create Todo"
            : activeTab === "routine"
            ? "Create Routine"
            : activeTab === "special-event"
            ? "Create Special Event"
            : activeTab === "appointment"
            ? "Create Appointment"
            : "Create Event"}
          {isLoading && <Loader2 className="animate-spin" />}
        </Button>
      </Tabs>
    </form>
  );
}
