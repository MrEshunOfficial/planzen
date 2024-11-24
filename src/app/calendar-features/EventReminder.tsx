import React, { useState, useEffect, useCallback } from "react";
import { Bell, MessageSquare, AlarmPlus, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactDatePicker from "react-datepicker";
import { IReminder } from "@/store/event.types";

interface ReminderComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onReminderSave?: (reminder: IReminder) => void;
  existingReminder?: IReminder;
  eventType?: "todo" | "routine" | "special-event" | "appointment";
  eventTitle?: string;
  eventDate?: Date;
  eventTime?: Date;
  eventData?: {
    priority?: string;
    appointmentType?: string;
    budget?: number;
    attendees?: number;
  };
}

export const ReminderComponent: React.FC<ReminderComponentProps> = ({
  open,
  onOpenChange,
  onClose,
  onReminderSave,
  existingReminder,
  eventType,
  eventTitle,
  eventDate,
  eventTime,
  eventData,
}) => {
  const reminderTypes = [
    {
      value: "notification",
      label: "Notification",
      icon: <Bell className="mr-2 h-4 w-4" />,
    },
    {
      value: "email",
      label: "Email",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      value: "sms",
      label: "SMS",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
  ] as const;

  const getSuggestedNotes = useCallback(() => {
    if (!eventData) return "";

    switch (eventType) {
      case "appointment":
        const notes = ["Don't forget to bring any necessary documents"];
        if (eventData.appointmentType === "medical") {
          notes.push("Bring medical history and insurance cards");
        }
        return notes.join(". ");

      case "special-event":
        const eventNotes = ["Check event requirements and dress code"];
        if ((eventData.budget || 0) > 1000) {
          eventNotes.push("Review budget allocation");
        }
        if ((eventData.attendees || 0) > 50) {
          eventNotes.push("Confirm attendance numbers");
        }
        return eventNotes.join(". ");

      case "todo":
        if (eventData.priority === "high") {
          return "High priority task - requires immediate attention";
        }
        return "";

      default:
        return "";
    }
  }, [eventType, eventData]);

  const getDefaultReminderSettings = useCallback(() => {
    const baseSettings = {
      todo: {
        type: "notification" as const,
        time: new Date().setHours(9, 0, 0, 0),
        recurrence: "none" as const,
        reminderOffset: 0,
      },
      routine: {
        type: "notification" as const,
        time: eventTime?.getTime() || new Date().setHours(8, 0, 0, 0),
        recurrence: "daily" as const,
        reminderOffset: 0,
      },
      "special-event": {
        type: "email" as const,
        time: eventTime?.getTime() || new Date().setHours(10, 0, 0, 0),
        recurrence: "none" as const,
        reminderOffset: 7,
      },
      appointment: {
        type: "sms" as const,
        time: eventTime?.getTime() || new Date().setHours(9, 0, 0, 0),
        recurrence: "none" as const,
        reminderOffset: 1,
      },
    };

    if (eventData && eventType) {
      const settings = { ...baseSettings[eventType] };

      if (eventType === "todo" && eventData.priority) {
        switch (eventData.priority) {
          case "high":
            settings.type = "sms";
            settings.reminderOffset = 1;
            break;
          case "medium":
            settings.type = "email";
            settings.reminderOffset = 0;
            break;
        }
      }

      if (eventType === "appointment" && eventData.appointmentType) {
        switch (eventData.appointmentType) {
          case "medical":
            settings.reminderOffset = 2;
            settings.type = "sms";
            break;
          case "business":
            settings.type = "email";
            settings.reminderOffset = 1;
            break;
        }
      }

      if (eventType === "special-event") {
        const isMajorEvent =
          (eventData.budget || 0) > 1000 || (eventData.attendees || 0) > 50;
        if (isMajorEvent) {
          settings.reminderOffset = 14;
          settings.type = "sms";
        }
      }

      return settings;
    }

    return baseSettings[eventType || "todo"];
  }, [eventType, eventTime, eventData]);

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [reminderType, setReminderType] = useState<
    "notification" | "email" | "sms"
  >("notification");
  const [recurrence, setRecurrence] = useState<
    "none" | "daily" | "weekly" | "monthly" | "yearly"
  >("none");
  const [notes, setNotes] = useState("");

  // Helper function to format time for display
  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  // Helper function to parse time string to Date
  const parseTimeString = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Effect to update form when event details change
  useEffect(() => {
    const settings = getDefaultReminderSettings();

    // Update title
    setReminderTitle(eventTitle ? `Reminder: ${eventTitle}` : "");

    // Update type
    setReminderType(settings.type);

    // Update time
    const defaultTime = eventTime || new Date(settings.time);
    setReminderTime(defaultTime);

    // Update recurrence
    setRecurrence(settings.recurrence);

    // Update date
    if (eventDate) {
      const defaultDate = new Date(eventDate);
      defaultDate.setDate(defaultDate.getDate() - settings.reminderOffset);
      setReminderDate(defaultDate);
    }

    // Update notes
    setNotes(getSuggestedNotes());
  }, [
    eventTitle,
    eventDate,
    eventTime,
    eventType,
    eventData,
    getDefaultReminderSettings,
    getSuggestedNotes,
  ]);

  const handleSave = () => {
    if (!reminderTitle || !reminderDate || !reminderTime) return;

    const reminder: IReminder = {
      title: reminderTitle,
      date: reminderDate,
      time: reminderTime,
      type: reminderType,
      recurrence,
      notes: notes || getSuggestedNotes(),
    };

    onReminderSave?.(reminder);
    onOpenChange(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="default"
        size="icon"
        onClick={() => onOpenChange(true)}
        className="w-full flex items-center gap-2"
      >
        <AlarmPlus className="h-4 w-4" />
        <span>Add Reminder</span>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {existingReminder ? "Edit Reminder" : "Create Reminder"}
            </DialogTitle>
            <DialogDescription>
              Configure your reminder for{" "}
              {eventType?.replace("-", " ") || "event"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                placeholder="Enter reminder title"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date & Time
              </Label>
              <div className="col-span-3 flex space-x-2">
                <ReactDatePicker
                  selected={reminderDate}
                  onChange={(date: Date | null) => setReminderDate(date)}
                  className="w-full p-2 border rounded"
                  placeholderText="Select Date"
                />
                <Input
                  type="time"
                  value={reminderTime ? formatTimeForInput(reminderTime) : ""}
                  onChange={(e) =>
                    setReminderTime(parseTimeString(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <RadioGroup
                value={reminderType}
                onValueChange={(value: "notification" | "email" | "sms") =>
                  setReminderType(value)
                }
                className="col-span-3 flex space-x-4"
              >
                {reminderTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="flex items-center">
                      {type.icon}
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurrence" className="text-right">
                Reminder Repeat Interval
              </Label>
              <Select
                value={recurrence}
                onValueChange={(
                  value: "none" | "daily" | "weekly" | "monthly" | "yearly"
                ) => setRecurrence(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={getSuggestedNotes() || "Additional notes"}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!reminderTitle || !reminderDate}
            >
              {existingReminder ? "Update Reminder" : "Create Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
