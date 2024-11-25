import React from "react";
import { useSelector } from "react-redux";
import { EventType, Priority } from "@/store/event.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckSquare2,
  Calendar,
  Repeat,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  selectEvents,
  selectUpcomingEvents,
  selectOverdueTodos,
  IEvent,
} from "@/store/event.slice";
import { RootState } from "@/store";

interface EventTypeStats {
  [key: string]: {
    total: number;
    completed: number;
    active: number;
    highPriority: number;
    currentStreak?: number;
  };
}

const AsideContent: React.FC = () => {
  const events = useSelector(selectEvents);
  const upcomingEvents = useSelector((state: RootState) =>
    selectUpcomingEvents(state, 7)
  );
  const overdueTodos = useSelector(selectOverdueTodos);

  // Calculate event type statistics
  const stats: EventTypeStats = events.reduce(
    (acc: EventTypeStats, event: IEvent) => {
      // Initialize if not exists
      if (!acc[event.type]) {
        acc[event.type] = {
          total: 0,
          completed: 0,
          active: 0,
          highPriority: 0,
        };
      }

      acc[event.type].total++;

      // Handle todos
      if (event.type === EventType.TODO) {
        if (event.todoData?.isCompleted) {
          acc[event.type].completed++;
        } else {
          acc[event.type].active++;
        }
        if (event.todoData?.priority === Priority.HIGH) {
          acc[event.type].highPriority++;
        }
      }

      // Handle routines
      if (event.type === EventType.ROUTINE) {
        if (event.routineData?.priority === Priority.HIGH) {
          acc[event.type].highPriority++;
        }
        // Calculate streak
        if (typeof acc[event.type].currentStreak === "undefined") {
          acc[event.type].currentStreak = 0;
        }
      }

      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">{upcomingEvents.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Todo Stats */}
      {stats[EventType.TODO] && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare2 className="h-5 w-5" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">
                  {stats[EventType.TODO].active}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-semibold">
                  {stats[EventType.TODO].completed}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-xl font-semibold">
                {stats[EventType.TODO].highPriority}
              </p>
            </div>
            {overdueTodos.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {overdueTodos.length} overdue
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Routine Stats */}
      {stats[EventType.ROUTINE] && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Routines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">
                  {stats[EventType.ROUTINE].active}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-semibold">
                  {stats[EventType.ROUTINE].completed}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-xl font-semibold">
                {stats[EventType.ROUTINE].currentStreak || 0} days
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming (7 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming events
              </p>
            ) : (
              upcomingEvents.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm truncate">{event.title}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsideContent;
