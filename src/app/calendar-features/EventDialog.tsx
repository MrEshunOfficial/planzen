import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, X } from "lucide-react";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    start: string;
    end?: string;
    location?: string;
    attendees?: number;
    status?: "upcoming" | "in-progress" | "completed";
    allDay?: boolean;
  } | null;
}

const EventDialog = ({ isOpen, onClose, event }: EventDialogProps) => {
  if (!event) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = () => {
    const statusStyles: Record<string, string> = {
      upcoming: "bg-indigo-100 text-indigo-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };

    // Check if event exists and has a status; default to 'upcoming' if not
    const status = event?.status || "upcoming";
    const style = statusStyles[status];

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${style}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="text-xl font-semibold">{event.title}</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <p className="font-medium">Time</p>
              {event.allDay ? (
                <p>All Day</p>
              ) : (
                <div>
                  <p>Start: {formatDateTime(event.start)}</p>
                  {event.end && <p>End: {formatDateTime(event.end)}</p>}
                </div>
              )}
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <p className="font-medium">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
          )}

          {event.attendees && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <p className="font-medium">Attendees</p>
                <p>{event.attendees} people</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <p className="font-medium">Status</p>
              {getStatusBadge()}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
