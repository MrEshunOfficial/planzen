import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, User, MapPin, Globe, Mail, AtSign, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import {
  createProfile,
  updateProfile,
  selectProfile,
  selectProfileStatus,
} from "@/store/profile.slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  image: z.string().nullable(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  mode: "create" | "update";
}

export default function ProfileForm({ mode = "create" }: ProfileFormProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const profile = useSelector(selectProfile);
  const status = useSelector(selectProfileStatus);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues:
      mode === "update"
        ? {
            name: profile?.name || "",
            username: profile?.username || "",
            email: profile?.email || "",
            image: profile?.image || null,
            bio: profile?.bio || "",
            location: profile?.location || "",
            website: profile?.website || "",
          }
        : {
            name: "",
            username: "",
            email: "",
            image: null,
            bio: "",
            location: "",
            website: "",
          },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const action = mode === "create" ? createProfile : updateProfile;
      // @ts-ignore - Redux Thunk typing issue
      const resultAction = await dispatch(action(data));

      if (action.fulfilled.match(resultAction)) {
        toast({
          title: mode === "create" ? "Profile Created" : "Profile Updated",
          description:
            mode === "create"
              ? "Your profile has been successfully created."
              : "Your profile has been successfully updated.",
        });
      } else {
        throw new Error(
          mode === "create"
            ? "Failed to create profile"
            : "Failed to update profile"
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} profile. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-2">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <User className="h-6 w-6 md:h-7 md:w-7" />
            {mode === "create" ? "Create Profile" : "Edit Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form Fields Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                        <User className="h-4 w-4" />
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          className="text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                        <AtSign className="h-4 w-4" />
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          className="text-sm md:text-base"
                        />
                      </FormControl>
                      <FormDescription className="text-xs md:text-sm">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          className="text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your location"
                          {...field}
                          className="text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Full Width Fields */}
              <div className="space-y-6">
                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                        <Info className="h-4 w-4" />
                        Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="min-h-[100px] resize-none text-sm md:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs md:text-sm">
                        Brief description for your profile.
                      </FormDescription>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Website */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                        <Globe className="h-4 w-4" />
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://your-website.com"
                          {...field}
                          className="text-sm md:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-sm md:text-base"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : mode === "create" ? (
                  "Create Profile"
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
