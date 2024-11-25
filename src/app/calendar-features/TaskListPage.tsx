import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Tag,
  Trash2,
  Edit,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  Phone,
  Users,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import {
  deleteEvent,
  toggleTodoCompletion,
  updateEvent,
  selectFilteredEvents,
  selectEventsStatus,
  selectEventsError,
  IEvent,
} from "@/store/event.slice";
import { AppDispatch } from "@/store";
import {
  EventType,
  Priority,
  ITodo,
  IRoutine,
  ISpecialEvent,
  IAppointment,
  RepeatType,
  EndRepeatOption,
} from "@/store/event.types";
import { Toaster } from "@/components/ui/toaster";

const TaskListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filteredEvents = useSelector(selectFilteredEvents);
  const status = useSelector(selectEventsStatus);
  const error = useSelector(selectEventsError);

  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<IEvent | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "bg-red-100 text-red-800";
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case Priority.LOW:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderRepeatInfo = (repeat?: { type: RepeatType; config?: any }) => {
    if (!repeat) return null;

    const repeatFrequency = repeat.type.toLowerCase();
    const repeatConfig = repeat.config || {};

    let repeatText = `Repeats ${repeatFrequency}`;

    if (repeatConfig.interval && repeatConfig.interval > 1) {
      repeatText = `Repeats every ${repeatConfig.interval} ${repeatFrequency}s`;
    }

    return (
      <div className="text-sm text-gray-600">
        <p>{repeatText}</p>
      </div>
    );
  };

  const renderReminders = (reminders: any[]) => {
    if (!reminders || reminders.length === 0) return null;
    return (
      <div className="space-y-2">
        {reminders.map((reminder, index) => (
          <div key={index} className="text-sm text-gray-600">
            <span>{formatDate(reminder.date)} </span>
            {reminder.time && <span>at {formatTime(reminder.time)}</span>}
          </div>
        ))}
      </div>
    );
  };

  const handleToggleCompletion = async (event: IEvent) => {
    if (event?.type === EventType.TODO && event?.todoData) {
      try {
        await dispatch(
          toggleTodoCompletion({
            eventId: event._id,
            isCompleted: !event.todoData.isCompleted,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to toggle todo completion:", error);
      }
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await dispatch(deleteEvent(eventId)).unwrap();
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleEdit = () => {
    setEditedEvent(selectedEvent);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedEvent) {
      try {
        await dispatch(
          updateEvent({
            id: editedEvent._id,
            event: editedEvent,
          })
        ).unwrap();
        setIsEditing(false);
        setSelectedEvent(editedEvent);
      } catch (error) {
        console.error("Failed to update event:", error);
      }
    }
  };

  const renderEventDetails = () => {
    const event = isEditing ? editedEvent : selectedEvent;
    if (!event) return null;

    return (
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={event.title}
              onChange={(e) =>
                setEditedEvent({ ...event, title: e.target.value })
              }
              className="text-lg font-bold w-full"
            />
            {renderEditForm(event)}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold break-words">{event.title}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(event._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
                {event.startTime && (
                  <>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatTime(event.startTime)}</span>
                    {event.endTime && (
                      <span> - {formatTime(event.endTime)}</span>
                    )}
                  </>
                )}
              </div>

              {event.repeat && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {renderRepeatInfo(event.repeat)}
                </div>
              )}

              {event.reminders && event.reminders.length > 0 && (
                <div className="space-y-1">
                  {renderReminders(event.reminders)}
                </div>
              )}
            </div>

            {renderEventTypeSpecificDetails(event)}
          </div>
        )}
      </div>
    );
  };

  const renderEventTypeSpecificDetails = (event: IEvent) => {
    switch (event.type) {
      case EventType.TODO:
        return renderTodoDetails(event.todoData);
      case EventType.ROUTINE:
        return renderRoutineDetails(event.routineData);
      case EventType.SPECIAL_EVENT:
        return renderSpecialEventDetails(event.specialEventData);
      case EventType.APPOINTMENT:
        return renderAppointmentDetails(event.appointmentData);
      default:
        return null;
    }
  };

  const renderTodoDetails = (todoData?: ITodo) => {
    if (!todoData) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {todoData.isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}
          <span>{todoData.isCompleted ? "Completed" : "Pending"}</span>
        </div>

        {todoData.description && (
          <p className="text-gray-600">{todoData.description}</p>
        )}

        {todoData.priority && (
          <Badge className={getPriorityColor(todoData.priority)}>
            {todoData.priority} Priority
          </Badge>
        )}

        {todoData.tags && todoData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {todoData.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {todoData.links && todoData.links.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Related Links
            </h4>
            <ul className="space-y-1">
              {todoData.links.map((link, index) => (
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
    );
  };

  const renderRoutineDetails = (routineData?: IRoutine) => {
    if (!routineData) return null;
    return (
      <div className="space-y-3">
        {routineData.priority && (
          <Badge className={getPriorityColor(routineData.priority)}>
            {routineData.priority} Priority
          </Badge>
        )}
        {routineData.label && (
          <Badge variant="outline">{routineData.label}</Badge>
        )}
        {routineData.routineNotes && (
          <p className="text-gray-600">{routineData.routineNotes}</p>
        )}
      </div>
    );
  };

  const renderSpecialEventDetails = (specialEventData?: ISpecialEvent) => {
    if (!specialEventData) return null;
    return (
      <div className="space-y-3">
        {specialEventData.eventName && (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span>{specialEventData.eventName}</span>
          </div>
        )}
        {specialEventData.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{specialEventData.location}</span>
          </div>
        )}
        {specialEventData.attendees && (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span>{specialEventData.attendees} attendees</span>
          </div>
        )}
        {specialEventData.budget && (
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <span>${specialEventData.budget.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentDetails = (appointmentData?: IAppointment) => {
    if (!appointmentData) return null;
    return (
      <div className="space-y-3">
        {appointmentData.appointmentType && (
          <Badge variant="outline">
            {appointmentData.appointmentType.replace(/_/g, " ")}
          </Badge>
        )}
        {appointmentData.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{appointmentData.venue}</span>
          </div>
        )}
        {appointmentData.contactNumber && (
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <span>{appointmentData.contactNumber}</span>
          </div>
        )}
        {appointmentData.appointmentLinks && (
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Related Links
            </h4>
            <ul className="space-y-1">
              {appointmentData.appointmentLinks.map((link, index) => (
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
    );
  };

  const renderEditForm = (event: IEvent) => {
    switch (event.type) {
      case EventType.TODO:
        return (
          <div className="space-y-4">
            <Textarea
              value={event.todoData?.description || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  todoData: { ...event.todoData!, description: e.target.value },
                })
              }
              placeholder="Description"
            />
            <Select
              value={event.todoData?.priority || Priority.MEDIUM}
              onValueChange={(value) =>
                setEditedEvent({
                  ...event,
                  todoData: { ...event.todoData!, priority: value as Priority },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Priority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case EventType.ROUTINE:
        return (
          <div className="space-y-4">
            <Input
              value={event.routineData?.label || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  routineData: { ...event.routineData!, label: e.target.value },
                })
              }
              placeholder="Label"
            />
            <Textarea
              value={event.routineData?.routineNotes || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  routineData: {
                    ...event.routineData!,
                    routineNotes: e.target.value,
                  },
                })
              }
              placeholder="Notes"
            />
          </div>
        );
      case EventType.SPECIAL_EVENT:
        return (
          <div className="space-y-4">
            <Input
              value={event.specialEventData?.eventName || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  specialEventData: {
                    ...event.specialEventData!,
                    eventName: e.target.value,
                  },
                })
              }
              placeholder="Event Name"
            />
            <Input
              value={event.specialEventData?.location || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  specialEventData: {
                    ...event.specialEventData!,
                    location: e.target.value,
                  },
                })
              }
              placeholder="Location"
            />
            <Input
              type="number"
              value={event.specialEventData?.attendees || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  specialEventData: {
                    ...event.specialEventData!,
                    attendees: parseInt(e.target.value),
                  },
                })
              }
              placeholder="Number of Attendees"
            />
            <Input
              type="number"
              value={event.specialEventData?.budget || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  specialEventData: {
                    ...event.specialEventData!,
                    budget: parseFloat(e.target.value),
                  },
                })
              }
              placeholder="Budget"
            />
          </div>
        );
      case EventType.APPOINTMENT:
        return (
          <div className="space-y-4">
            <Input
              value={event.appointmentData?.venue || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  appointmentData: {
                    ...event.appointmentData!,
                    venue: e.target.value,
                  },
                })
              }
              placeholder="Venue"
            />
            <Input
              value={event.appointmentData?.contactNumber || ""}
              onChange={(e) =>
                setEditedEvent({
                  ...event,
                  appointmentData: {
                    ...event.appointmentData!,
                    contactNumber: e.target.value,
                  },
                })
              }
              placeholder="Contact Number"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-2">
      <div className="w-full h-[72vh] flex flex-col gap-2 overflow-auto">
        {status === "loading" ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </div>
        ) : status === "failed" ? (
          <div>oops! failed to load data, please try refreshing!</div>
        ) : (
          filteredEvents.map((event) => (
            <Card
              key={event._id}
              className="w-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedEvent(event)}
            >
              <CardHeader className="pb-2">
                <div className="w-full flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(event.date)}
                      {event.startTime && ` at ${formatTime(event.startTime)}`}
                    </CardDescription>
                  </div>
                  {event.type === EventType.TODO && (
                    <Checkbox
                      checked={event.todoData?.isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCompletion(event);
                      }}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{event.type}</Badge>
                  {event.todoData?.priority && (
                    <Badge
                      className={getPriorityColor(event.todoData.priority)}
                    >
                      {event.todoData.priority}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isMobileView ? (
        <Sheet
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Event Details</SheetTitle>
            </SheetHeader>
            {renderEventDetails()}
          </SheetContent>
        </Sheet>
      ) : (
        selectedEvent && (
          <Sheet
            open={!!selectedEvent}
            onOpenChange={() => setSelectedEvent(null)}
          >
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Event Details</SheetTitle>
              </SheetHeader>
              {renderEventDetails()}
            </SheetContent>
          </Sheet>
        )
      )}
      <Toaster />
    </div>
  );
};

export default TaskListPage;
