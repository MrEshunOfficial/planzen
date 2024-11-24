"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import {
  fetchUserProfile,
  selectProfileStatus,
  selectProfileError,
} from "@/store/profile.slice";
import { fetchEvents } from "@/store/event.slice";

interface UnifiedFetchProps {
  children: React.ReactNode;
}

const UnifiedFetch = ({ children }: UnifiedFetchProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status: authStatus } = useSession();

  // Select states from both slices
  const profileStatus = useSelector(selectProfileStatus);
  const profileError = useSelector(selectProfileError);
  const eventsLoading = useSelector((state: RootState) => state.events.loading);
  const eventsError = useSelector((state: RootState) => state.events.error);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (authStatus === "authenticated" && session?.user?.id) {
      dispatch(fetchUserProfile());
      dispatch(fetchEvents(session.user.id));
    }
  }, [dispatch, authStatus, session?.user?.id]);

  // Show loading state while authenticating or fetching any data
  if (
    authStatus === "loading" ||
    (authStatus === "authenticated" &&
      (profileStatus === "loading" || eventsLoading))
  ) {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show errors if either fetch failed
  if (profileStatus === "failed" && profileError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-4">
        <AlertDescription>{profileError}</AlertDescription>
      </Alert>
    );
  }

  if (eventsError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-4">
        <AlertDescription>{eventsError}</AlertDescription>
      </Alert>
    );
  }

  // Render children once everything is ready
  return <>{children}</>;
};

export default UnifiedFetch;
