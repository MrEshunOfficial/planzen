import React from "react";
import {
  Clock,
  MapPin,
  User,
  Tag,
  AlertCircle,
  Repeat,
  Link as LinkIcon2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EventType, Priority, RepeatType } from "@/store/event.types";
import { IEvent } from "@/store/event.slice";

interface EventProps extends Partial<IEvent> {
  className?: string;
  onEdit?: (id: string) => void;
}

const CalendarEvent = ({
  title,
  type,
  startTime,
  endTime,
  isAllDayEvent = false,
  todoData,
  routineData,
  specialEventData,
  appointmentData,
  reminders,
  repeat,
}: EventProps) => {
  const formatTime = (date: Date | string | undefined | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTypeStyles = () => {
    switch (type) {
      case EventType.TODO:
        return "border-l-4 border-blue-500 bg-blue-50/80 dark:bg-blue-950/20 dark:border-blue-400";
      case EventType.ROUTINE:
        return "border-l-4 border-green-500 bg-green-50/80 dark:bg-green-950/20 dark:border-green-400";
      case EventType.SPECIAL_EVENT:
        return "border-l-4 border-purple-500 bg-purple-50/80 dark:bg-purple-950/20 dark:border-purple-400";
      case EventType.APPOINTMENT:
        return "border-l-4 border-orange-500 bg-orange-50/80 dark:bg-orange-950/20 dark:border-orange-400";
      default:
        return "border-l-4 border-gray-500 bg-gray-50/80 dark:bg-gray-950/20 dark:border-gray-400";
    }
  };

  const getPriorityColor = (priority: Priority | undefined) => {
    switch (priority) {
      case Priority.HIGH:
        return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-200";
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200";
      case Priority.LOW:
        return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/40 dark:text-gray-200";
    }
  };

  const getEventPriority = () => {
    return todoData?.priority || routineData?.priority;
  };

  const getEventLocation = () => {
    return specialEventData?.location || appointmentData?.venue;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative flex flex-col p-3 rounded-md",
          "transition-[transform,box-shadow] duration-200 ease-in-out",
          "hover:ring-2 hover:ring-opacity-50",
          "hover:ring-black/5 dark:hover:ring-white/10",
          "text-gray-900 dark:text-gray-100",
          getEventLocation() && "border-b border-gray-200 dark:border-gray-700",
          getTypeStyles()
        )}
      >
        {/* Header section */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-medium truncate">{title}</h3>
            {getEventPriority() && (
              <Badge
                variant="outline"
                className={cn(
                  "mt-1 text-xs",
                  getPriorityColor(getEventPriority())
                )}
              >
                {getEventPriority()}
              </Badge>
            )}
          </div>

          <Badge
            variant="outline"
            className="text-xs capitalize dark:border-gray-600"
          >
            {type?.replace("-", " ")}
          </Badge>
        </div>

        {/* Time section */}
        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="w-3 h-3" />
          {isAllDayEvent ? (
            <span>All Day</span>
          ) : (
            <span>
              {formatTime(startTime)}
              {endTime && ` - ${formatTime(endTime)}`}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {getEventLocation() && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[200px]">
                {getEventLocation()}
              </span>
            </div>
          )}

          {specialEventData?.attendees && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <User className="w-3 h-3" />
              <span>
                {specialEventData.attendees} attendee
                {specialEventData.attendees !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {todoData?.tags && todoData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {todoData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-100 dark:bg-gray-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {(todoData?.links || appointmentData?.appointmentLinks) && (
            <div className="flex flex-wrap gap-1">
              {(todoData?.links || appointmentData?.appointmentLinks || []).map(
                (link, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-100 dark:bg-gray-800"
                  >
                    <LinkIcon2 className="w-3 h-3 mr-1" />
                    {link}
                  </Badge>
                )
              )}
            </div>
          )}

          {repeat && repeat.type !== RepeatType.NO_REPEAT && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Repeat className="w-3 h-3" />
                  <span>Repeats {repeat.type.toLowerCase()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <p>
                  Repeats every {repeat.config?.repeatFrequency || 1}{" "}
                  {repeat.config?.repeatPattern}
                </p>
                {repeat.config?.endDate && (
                  <p>
                    Until {new Date(repeat.config.endDate).toLocaleDateString()}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          )}

          {reminders && reminders.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <AlertCircle className="w-3 h-3" />
              <span>
                {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CalendarEvent;
