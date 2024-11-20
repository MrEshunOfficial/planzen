import React from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Event status types for visual differentiation
type EventStatus = "upcoming" | "in-progress" | "completed";

interface EventProps {
  title: string;
  start: string;
  end?: string;
  location?: string;
  attendees?: number;
  status?: EventStatus;
  isAllDay?: boolean;
  className?: string;
}

const CalendarEvent = ({
  title,
  start,
  end,
  location,
  attendees,
  status = "upcoming",
  isAllDay = false,
  className,
}: EventProps) => {
  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status-based styling
  const getStatusStyles = () => {
    switch (status) {
      case "in-progress":
        return "border-l-4 border-blue-500 bg-blue-50";
      case "completed":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-indigo-500 bg-indigo-50";
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col p-2 rounded-md shadow-sm",
        "hover:shadow-md transition-shadow duration-200",
        getStatusStyles(),
        className
      )}
    >
      {/* Title section */}
      <div className="font-medium text-gray-900 truncate">{title}</div>

      {/* Time section */}
      <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
        <Clock className="w-3 h-3" />
        {isAllDay ? (
          <span>All Day</span>
        ) : (
          <span>
            {formatTime(start)}
            {end && ` - ${formatTime(end)}`}
          </span>
        )}
      </div>

      {/* Additional details section */}
      <div className="flex flex-wrap gap-2 mt-1">
        {location && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{location}</span>
          </div>
        )}
        {attendees && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>
              {attendees} attendee{attendees !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1">
          <button
            className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
            aria-label="Edit event"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarEvent;
