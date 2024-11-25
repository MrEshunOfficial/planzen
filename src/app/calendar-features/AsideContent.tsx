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
  ChevronRight,
  ArrowUpRight,
  Target,
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

const StatBadge = ({
  value,
  label,
  trend,
}: {
  value: string | number;
  label: string;
  trend?: "up" | "down";
}) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <span className="text-xl md:text-2xl font-extrabold text-foreground">
        {value}
      </span>
      {trend && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? "+2.5%" : "-1.2%"}
        </span>
      )}
    </div>
    <span className="text-xs md:text-sm font-medium text-muted-foreground">
      {label}
    </span>
  </div>
);

const ProgressRing = ({ progress }: { progress: number }) => (
  <div className="relative h-10 w-10 md:h-12 md:w-12">
    <svg className="h-10 w-10 md:h-12 md:w-12 -rotate-90">
      <circle
        className="text-secondary"
        strokeWidth="4"
        stroke="currentColor"
        fill="transparent"
        r="16"
        cx="20"
        cy="20"
      />
      <circle
        className="text-primary"
        strokeWidth="4"
        strokeDasharray={`${progress * 100.48} 100.48`}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="16"
        cx="20"
        cy="20"
      />
    </svg>
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-xs font-bold">
      {Math.round(progress * 100)}%
    </span>
  </div>
);

const AsideContent: React.FC = () => {
  const events = useSelector(selectEvents);
  const upcomingEvents = useSelector((state: RootState) =>
    selectUpcomingEvents(state, 7)
  );
  const overdueTodos = useSelector(selectOverdueTodos);

  // Calculate event type statistics
  const stats: EventTypeStats = events.reduce(
    (acc: EventTypeStats, event: IEvent) => {
      if (!acc[event.type]) {
        acc[event.type] = {
          total: 0,
          completed: 0,
          active: 0,
          highPriority: 0,
        };
      }

      acc[event.type].total++;

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

      if (event.type === EventType.ROUTINE) {
        if (event.routineData?.priority === Priority.HIGH) {
          acc[event.type].highPriority++;
        }
        if (typeof acc[event.type].currentStreak === "undefined") {
          acc[event.type].currentStreak = 0;
        }
      }

      return acc;
    },
    {}
  );

  const todoStats = stats[EventType.TODO] || { completed: 0, total: 0 };
  const completionRate = todoStats.total
    ? todoStats.completed / todoStats.total
    : 0;

  return (
    <div className="space-y-4 md:space-y-8 p-3 md:p-6">
      {/* Overview Section */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-4 md:mb-6">
          Dashboard Overview
        </h2>
        <div className="grid gap-4 md:gap-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <StatBadge
                  value={events.length}
                  label="Total Events"
                  trend="up"
                />
                <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="border-none shadow-md">
              <CardContent className="pt-4 md:pt-6">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-2xl md:text-3xl font-bold">
                    {upcomingEvents.length}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    This Week
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-4 md:pt-6">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-2xl md:text-3xl font-bold text-orange-500">
                    {overdueTodos.length}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Overdue
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tasks Progress Section */}
      {stats[EventType.TODO] && (
        <Card className="border-none shadow-md">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Tasks Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="space-y-1">
                <p className="text-xl md:text-2xl font-bold">
                  {stats[EventType.TODO].completed}/
                  {stats[EventType.TODO].total}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Tasks Completed
                </p>
              </div>
              <ProgressRing progress={completionRate} />
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-orange-50 dark:bg-orange-900">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <p className="text-xs md:text-sm font-medium text-orange-800 dark:text-orange-300">
                    High Priority
                  </p>
                </div>
                <p className="text-xs md:text-sm font-bold text-orange-600 dark:text-orange-400">
                  {stats[EventType.TODO].highPriority}
                </p>
              </div>

              <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-purple-50 dark:bg-purple-900">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <p className="text-xs md:text-sm font-medium text-purple-800 dark:text-purple-300">
                    Active Tasks
                  </p>
                </div>
                <p className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400">
                  {stats[EventType.TODO].active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Routines Section */}
      {stats[EventType.ROUTINE] && (
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6 pb-2">
            <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Repeat className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Routines
            </CardTitle>
            <span className="text-xs md:text-sm text-muted-foreground">
              Last 7 days
            </span>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-green-50 to-transparent">
                  <p className="text-2xl md:text-3xl font-bold text-green-600">
                    {stats[EventType.ROUTINE].currentStreak || 0}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-green-800">
                    Day Streak
                  </p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-50 to-transparent">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">
                    {stats[EventType.ROUTINE].active}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-blue-800">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events Section */}
      <Card className="border-none shadow-md p-0">
        <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6 pb-2">
          <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Upcoming Week
          </CardTitle>
          <button className="text-xs md:text-sm text-primary hover:text-primary/80 transition-colors">
            View All
          </button>
        </CardHeader>
        <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 md:py-6 text-center">
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-2 opacity-50" />
              <p className="text-xs md:text-sm text-muted-foreground">
                No upcoming events
              </p>
            </div>
          ) : (
            <div className="space-y-1 md:space-y-2">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="group flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-secondary/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-xs md:text-sm font-medium group-hover:text-primary transition-colors">
                      {event.title}
                    </p>
                  </div>
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AsideContent;
