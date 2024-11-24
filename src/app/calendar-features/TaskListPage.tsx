import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEvent,
  toggleTodoCompletion,
  updateEvent,
  IEvent,
} from "@/store/event.slice";
import { EventType, Priority } from "@/store/event.types";
import { Tag, Trash2, Edit, X } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
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
import { AppDispatch } from "@/store";

const TaskListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredEvents, loading, error } = useSelector(
    (state: any) => state.events
  );

  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<IEvent | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "text-red-500";
      case Priority.MEDIUM:
        return "text-yellow-500";
      case Priority.LOW:
        return "text-green-500";
      default:
        return "text-gray-500";
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

  const renderEventCard = (event: IEvent) => {
    const priority = event.todoData?.priority || event.routineData?.priority;

    return (
      <Card
        key={event._id}
        className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedEvent(event)}
      >
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base md:text-lg font-bold truncate">
                {event.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {formatDate(event.date)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              {priority && (
                <span
                  className={`text-sm font-medium ${getPriorityColor(
                    priority
                  )}`}
                >
                  {priority.toUpperCase()}
                </span>
              )}
              {event.type === EventType.TODO && (
                <Checkbox
                  checked={event.todoData?.isCompleted}
                  onCheckedChange={(checked) => {
                    handleToggleCompletion(event);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    );
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
            {event.type === EventType.TODO && (
              <>
                <Textarea
                  value={event.todoData?.description || ""}
                  onChange={(e) =>
                    setEditedEvent({
                      ...event,
                      todoData: {
                        ...event.todoData,
                        description: e.target.value,
                      },
                    })
                  }
                  placeholder="Description"
                  className="min-h-[100px] w-full"
                />
                <Select
                  value={event.todoData?.priority}
                  onValueChange={(value) =>
                    setEditedEvent({
                      ...event,
                      todoData: {
                        ...event.todoData,
                        priority: value as Priority,
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Priority.LOW}>Low</SelectItem>
                    <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Priority.HIGH}>High</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-bold break-words">
                {event.title}
              </h2>
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
                  <AlertDialogContent className="w-[90vw] max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(event._id)}
                        className="w-full sm:w-auto"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{formatDate(event.date)}</p>
            {event.todoData?.description && (
              <p className="text-gray-600 break-words">
                {event.todoData.description}
              </p>
            )}
            {event.todoData?.tags && event.todoData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.todoData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <section className="w-full h-full">
      <div className="w-full mx-auto p-4 md:p-3">
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found matching your criteria
            </div>
          ) : (
            filteredEvents.map(renderEventCard)
          )}
        </div>

        <Sheet
          open={!!selectedEvent}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedEvent(null);
              setIsEditing(false);
              setEditedEvent(null);
            }
          }}
        >
          <SheetContent
            side={isMobileView ? "bottom" : "right"}
            className={`w-full ${
              isMobileView ? "h-[80vh] rounded-t-xl" : "max-w-md"
            }`}
          >
            <SheetHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <SheetTitle>Event Details</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto max-h-[calc(100vh-180px)]">
              {renderEventDetails()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default TaskListPage;
