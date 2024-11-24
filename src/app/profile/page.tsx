"use client";
import React, { useRef } from "react";
import { User, Camera, Loader2 } from "lucide-react";
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
import ProfileForm from "./ProfileForm";
import { useDispatch, useSelector } from "react-redux";
import {
  IUserProfile,
  selectProfile,
  selectProfileStatus,
  updateProfilePicture,
} from "@/store/profile.slice";
import { toast } from "@/hooks/use-toast";
import { AppDispatch } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  <div className="grid grid-cols-3 gap-4 px-4 py-4">
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

const ProfileDetails: React.FC<{ profile: IUserProfile }> = ({ profile }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
        <p className="text-sm">{profile.email}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
        <p className="text-sm">@{profile.username}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
        <p className="text-sm">{profile.location || "Not specified"}</p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">
          Member since
        </h3>
        <p className="text-sm">{moment(profile.createdAt).format("LL")}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
        <p className="text-sm">
          {profile.website ? (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {new URL(profile.website).hostname}
            </a>
          ) : (
            "Not specified"
          )}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">
          Last updated
        </h3>
        <p className="text-sm">{moment(profile.updatedAt).format("LL")}</p>
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const { data: session } = useSession();
  const profile = useSelector(selectProfile);
  const profileStatus = useSelector(selectProfileStatus);
  const [activeTab, setActiveTab] = React.useState("overview");
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await dispatch(updateProfilePicture(file)).unwrap();
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been successfully uploaded.",
          duration: 5000,
        });
        event.target.value = "";
      } catch (error: any) {
        toast({
          title: "Failed to upload image",
          description: error.message || "An error occurred",
          duration: 5000,
          variant: "destructive",
        });
      }
    }
  };

  const stats: ProfileStats = {
    tasks: 128,
    completed: 95,
    streak: 12,
  };

  if (profileStatus === "loading") {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile && (profileStatus === "idle" || profileStatus === "failed")) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Welcome! Please complete your profile to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm mode="create" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-[88vh] max-w-6xl space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Profile Header */}
      <Card className="w-full h-full flex flex-col gap-2">
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <div className="h-24 sm:h-32 md:h-48 rounded-lg bg-gradient-to-r from-blue-950 to-blue-600" />

            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12 md:-mt-16 px-2 sm:px-4 md:px-6">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden relative group">
                <Avatar className="h-full w-full border-2 border-primary-500 rounded-full shadow-lg">
                  <AvatarImage
                    src={
                      profile?.profilePicture ||
                      session?.user?.image ||
                      undefined
                    }
                    alt={profile?.name || "User"}
                  />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  onClick={handleProfilePictureClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {profile?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      @{profile?.username}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="w-full sm:max-w-[500px] p-1">
                      <DialogHeader className="p-2">
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          {`Make changes to your profile here. Click save when
                          you're done.`}
                        </DialogDescription>
                      </DialogHeader>
                      <ProfileForm mode="update" />
                    </DialogContent>
                  </Dialog>
                </div>

                <p className="text-sm text-muted-foreground">
                  {profile?.bio || "No bio provided yet."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent className="flex-grow">
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
                  <CardTitle className="text-base sm:text-lg">
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile && <ProfileDetails profile={profile} />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Activity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your activity over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityGraph />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Task Statistics
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Overview of your task completion and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileStats stats={stats} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Recent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Your recent tasks will appear here.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Edit your profile settings here.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
