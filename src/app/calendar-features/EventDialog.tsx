import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  location?: string;
  attendees?: number;
  status?: "upcoming" | "in-progress" | "completed";
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!event) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">
                {event.allDay ? (
                  "All day"
                ) : (
                  <>
                    {formatDate(event.start)}
                    {event.end && ` - ${formatDate(event.end)}`}
                  </>
                )}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <p>{event.location}</p>
            </div>
          )}

          {event.attendees && (
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <p>{event.attendees} attendees</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div className="flex items-center">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium
                ${
                  event.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : event.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
