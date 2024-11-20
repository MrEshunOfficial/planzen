"use client";

import React from "react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import moment from "moment";

interface ProfileStats {
  tasks: number;
  completed: number;
  streak: number;
}

interface ActivityData {
  date: string;
  count: number;
}

const ProfileStats: React.FC<{ stats: ProfileStats }> = ({ stats }) => (
  <div className="grid grid-cols-3 gap-4 px-4 py-4 border-t border-b">
    {Object.entries(stats).map(([key, value]) => (
      <div key={key} className="flex flex-col items-center justify-center">
        <span className="text-xl md:text-2xl font-bold">{value}</span>
        <span className="text-xs md:text-sm text-muted-foreground capitalize">
          {key}
        </span>
      </div>
    ))}
  </div>
);

const ActivityGraph: React.FC = () => {
  // Sample activity data - replace with real data
  const activityData: ActivityData[] = Array.from({ length: 365 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    count: Math.floor(Math.random() * 5),
  }));

  return (
    <div className="w-full p-2 md:p-4 bg-card rounded-lg overflow-x-auto">
      <div className="space-y-1">
        <div className="grid grid-cols-[repeat(53,minmax(8px,1fr))] gap-1">
          {activityData.map((day, i) => (
            <div
              key={day.date}
              className={cn(
                "aspect-square rounded-sm",
                day.count === 0 && "bg-muted",
                day.count === 1 && "bg-emerald-100 dark:bg-emerald-900",
                day.count === 2 && "bg-emerald-300 dark:bg-emerald-700",
                day.count === 3 && "bg-emerald-500 dark:bg-emerald-500",
                day.count >= 4 && "bg-emerald-700 dark:bg-emerald-300"
              )}
              title={`${day.count} activities on ${new Date(
                day.date
              ).toLocaleDateString()}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = React.useState("overview");

  const stats: ProfileStats = {
    tasks: 128,
    completed: 95,
    streak: 12,
  };

  return (
    <div className="w-full max-w-5xl space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Profile Header */}
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-24 sm:h-32 md:h-48 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600" />

            {/* Profile Image and Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12 md:-mt-16 px-2 sm:px-4 md:px-6">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-background">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback>
                    <User className="w-8 h-8 sm:w-12 sm:h-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {session?.user?.name || "User Name"}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      @username
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    {session?.user?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    Joined {moment(session?.user?.createdAt).format("LL")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    Location
                  </span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    website.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Card>
        <ProfileStats stats={stats} />
      </Card>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">
            Activity
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">About</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Tell others a little about yourself
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground">
                No bio provided yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Activity</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                No activity yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityGraph />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Your tasks will appear here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Profile settings will appear here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
