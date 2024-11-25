import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Bell,
  Pencil,
  Trash2,
  Share2,
  Printer,
  Settings,
  Tag,
  CreditCard,
  Phone,
  FileText,
  CheckSquareIcon,
  CircleCheckIcon,
  Circle,
} from "lucide-react";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { deleteEvent, IEvent, toggleTodoCompletion } from "@/store/event.slice";
import {
  Priority,
  EventType,
  RepeatType,
  EndRepeatOption,
} from "@/store/event.types";
import { AppDispatch, RootState } from "@/store";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (eventId: string) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedEventId = useSelector(
    (state: RootState) => state.events.selectedEventId
  );
  const event = useSelector((state: RootState) =>
    state.events.events.find((e) => e._id === selectedEventId)
  );

  if (!event) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event._id);
    }
  };

  // Update the delete handler to handle the async action
  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(event._id)).unwrap();
      onClose();
      toast({
        title: "Event Deleted",
        description: "The selected event has been successfully deleted.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Event",
        description:
          "Failed to delete the selected event. Please try again later.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const handleToggleCompletion = async (event: IEvent) => {
    if (event?.type === EventType.TODO && event?.todoData) {
      try {
        await dispatch(
          toggleTodoCompletion({
            eventId: event?._id,
            isCompleted: !event?.todoData?.isCompleted,
          })
        ).unwrap();
        toast({
          title: "Event Completed",
          description: "The selected event has been marked as completed.",
          duration: 5000,
        });
      } catch (error) {
        toast({
          title: "oops! Something went wrong",
          description: "failed to mark completed event, please try again!",
          duration: 5000,
          variant: "destructive",
        });
      }
    }
  };

  const formatEventTime = (date: Date | undefined | null) => {
    if (!date) return "";
    return format(new Date(date), "h:mm a");
  };

  const formatDate = (date: Date | undefined | null) => {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const renderPriority = (priority: Priority) => {
    const colors = {
      [Priority.HIGH]: "bg-red-100 text-red-800",
      [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800",
      [Priority.LOW]: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={colors[priority]} variant="outline">
        {priority} Priority
      </Badge>
    );
  };

  const renderRepeatInfo = (repeat?: { type: RepeatType; config?: any }) => {
    if (!repeat) return null;

    const repeatFrequency = repeat.type.toLowerCase();
    const repeatConfig = repeat.config || {};

    let repeatText = `Repeats ${repeatFrequency}`;

    if (repeatConfig.interval && repeatConfig.interval > 1) {
      repeatText = `Repeats every ${repeatConfig.interval} ${repeatFrequency}s`;
    }

    if (repeatConfig.daysOfWeek?.length) {
      repeatText += ` on ${repeatConfig.daysOfWeek.join(", ")}`;
    }

    if (repeatConfig.endRepeatOption) {
      switch (repeatConfig.endRepeatOption) {
        case EndRepeatOption.ON:
          repeatText += ` until ${formatDate(repeatConfig.endDate)}`;
          break;
        case EndRepeatOption.AFTER:
          repeatText += ` for ${repeatConfig.occurrences} occurrences`;
          break;
        case EndRepeatOption.NEVER:
          repeatText += " (no end date)";
          break;
      }
    }

    return (
      <div className="ml-8 text-sm text-gray-600">
        <p>{repeatText}</p>
        {repeatConfig.exceptions?.length > 0 && (
          <div className="mt-1">
            <p className="font-medium">Exceptions:</p>
            <ul className="list-disc pl-4">
              {repeatConfig.exceptions.map((date: Date, index: number) => (
                <li key={index}>{formatDate(date)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderReminders = (reminders: any[]) => {
    return reminders.map((reminder, index) => (
      <div key={index} className="ml-8 space-y-1">
        <div className="flex items-center gap-2">
          {reminder.title && (
            <span className="font-medium text-gray-800">{reminder.title}</span>
          )}
          {reminder.type && (
            <Badge variant="outline" className="text-xs">
              {reminder.type}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {reminder.date && <span>{formatDate(reminder.date)} </span>}
          {reminder.time && <span>at {formatEventTime(reminder.time)}</span>}
        </div>
        {reminder.message && (
          <p className="text-sm text-gray-600">{reminder.message}</p>
        )}
        {reminder.method && (
          <p className="text-xs text-gray-500">via {reminder.method}</p>
        )}
      </div>
    ));
  };

  const renderEventTypeSpecificInfo = () => {
    switch (event.type) {
      case EventType.TODO:
        return (
          <>
            {event.todoData && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {event.todoData.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span>
                    {event.todoData.isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>
                {event.todoData.priority && (
                  <div className="flex items-center gap-2">
                    {renderPriority(event.todoData.priority)}
                  </div>
                )}
                {event.todoData.description && (
                  <p className="text-gray-600">{event.todoData.description}</p>
                )}
                {event.todoData.tags && event.todoData.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-gray-500" />
                    {event.todoData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {event.todoData.links && event.todoData.links.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-medium flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Related Links
                    </h4>
                    <ul className="space-y-1">
                      {event.todoData.links.map((link, index) => (
                        <li key={index}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        );

      case EventType.ROUTINE:
        return (
          <>
            {event.routineData && (
              <div className="space-y-3">
                {event.routineData.priority && (
                  <div className="flex items-center gap-2">
                    {renderPriority(event.routineData.priority)}
                  </div>
                )}
                {event.routineData.label && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <Badge variant="secondary">{event.routineData.label}</Badge>
                  </div>
                )}
                {event.routineData.routineNotes && (
                  <p className="text-gray-600">
                    {event.routineData.routineNotes}
                  </p>
                )}
              </div>
            )}
          </>
        );

      case EventType.SPECIAL_EVENT:
        return (
          <>
            {event.specialEventData && (
              <div className="space-y-3">
                {event.specialEventData.eventName && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span>{event.specialEventData.eventName}</span>
                  </div>
                )}
                {event.specialEventData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{event.specialEventData.location}</span>
                  </div>
                )}
                {event.specialEventData.attendees && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>{event.specialEventData.attendees} attendees</span>
                  </div>
                )}
                {event.specialEventData.budget && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <span>
                      ${event.specialEventData.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        );

      case EventType.APPOINTMENT:
        return (
          <>
            {event.appointmentData && (
              <div className="space-y-3">
                {event.appointmentData.appointmentType && (
                  <Badge variant="secondary">
                    {event.appointmentData.appointmentType.replace(/_/g, " ")}
                  </Badge>
                )}
                {event.appointmentData.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{event.appointmentData.venue}</span>
                  </div>
                )}
                {event.appointmentData.contactNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{event.appointmentData.contactNumber}</span>
                  </div>
                )}
                {event.appointmentData.appointmentLinks &&
                  event.appointmentData.appointmentLinks.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Related Links
                      </h4>
                      <ul className="space-y-1">
                        {event.appointmentData.appointmentLinks.map(
                          (link, index) => (
                            <li key={index}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline break-all"
                              >
                                {link}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {event.appointmentData.additionalNotes && (
                  <p className="text-gray-600">
                    {event.appointmentData.additionalNotes}
                  </p>
                )}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl + ${
          event?.todoData?.isCompleted ? "opacity-70" : ""
        }`}
      >
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold">
                {event.title}
              </DialogTitle>
              <Badge variant="outline">{event.type.replace(/-/g, " ")}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {formatDate(event.date)}
                  {!event.isAllDayEvent && (
                    <span className="ml-2">
                      {formatEventTime(event.startTime)} -{" "}
                      {formatEventTime(event.endTime)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {event.repeat && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Repeat className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Repeat Schedule</span>
                </div>
                {renderRepeatInfo(event.repeat)}
              </div>
            )}

            {event.reminders && event.reminders.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Reminders</span>
                </div>
                {renderReminders(event.reminders)}
              </div>
            )}

            {renderEventTypeSpecificInfo()}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <ActionButtons
            event={event}
            handleToggleCompletion={handleToggleCompletion}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ActionButtonsProps {
  event: IEvent;
  handleToggleCompletion: (event: IEvent) => Promise<void>;
  handleEdit: () => void;
  handleDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  event,
  handleToggleCompletion,
  handleEdit,
  handleDelete,
}) => {
  return (
    <TooltipProvider>
      <div className="flex gap-2 flex-wrap justify-end">
        {event.type === EventType.TODO && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={
                  event?.todoData?.isCompleted ? "destructive" : "outline"
                }
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleCompletion(event);
                }}
                className="p-2"
              >
                {event?.todoData?.isCompleted ? (
                  <CircleCheckIcon size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {event?.todoData?.isCompleted
                  ? "Mark as incomplete"
                  : "Mark as complete"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="p-2"
            >
              <Share2 size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share event</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="p-2"
            >
              <Printer size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Print event</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="p-2"
            >
              <Settings size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Event settings</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              className="p-2"
            >
              <Pencil size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit event</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="p-2"
            >
              <Trash2 size={20} className="text-red-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete event</p>
          </TooltipContent>
        </Tooltip>
        <Toaster />
      </div>
    </TooltipProvider>
  );
};

export default EventDialog;
