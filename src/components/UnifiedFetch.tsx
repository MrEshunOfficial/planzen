"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/ui/LoadingContent";
import { toast } from "@/hooks/use-toast";

import { Progress } from "@/components/ui/progress";
import { AppDispatch, RootState } from "@/store";
import { fetchUserProfile } from "@/store/profile.slice";
import {
  fetchEvents,
  selectEvents,
  selectEventsStatus,
} from "@/store/event.slice";
import { Button } from "./ui/button";
import Link from "next/link";

interface UnifiedFetchProps {
  children: React.ReactNode;
}

interface FetchOperation {
  name: string;
  status: "pending" | "loading" | "completed";
  progress: number;
}

const UnifiedProfileFetch: React.FC<UnifiedFetchProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id;

  const {
    profile,
    error: profileError,
    loading: profileLoading,
  } = useSelector((state: RootState) => state.profile);

  const eventsStatus = useSelector(selectEventsStatus);
  const events = useSelector(selectEvents);
  const eventsError = useSelector((state: RootState) => state.events.error);

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [allOperationsComplete, setAllOperationsComplete] = useState(false);
  const [operations, setOperations] = useState<FetchOperation[]>([
    { name: "Profile", status: "pending", progress: 0 },
    { name: "Events", status: "pending", progress: 0 },
  ]);

  const totalProgress = Math.floor(
    operations.reduce((acc, op) => acc + op.progress, 0) / operations.length
  );

  const getLoadingMessage = () => {
    if (totalProgress === 100) return "Setup complete";
    return (
      <p>
        Loading data, please wait <span className="animate-bounce">...</span>{" "}
      </p>
    );
  };

  const updateOperationProgress = useCallback(
    (
      operationIndex: number,
      progress: number,
      status?: "loading" | "completed"
    ) => {
      setOperations((prevOps) =>
        prevOps.map((op, index) =>
          index === operationIndex
            ? {
                ...op,
                progress,
                status: status || (progress === 100 ? "completed" : "loading"),
              }
            : op
        )
      );
    },
    []
  );

  const simulateProgress = useCallback(
    (operationIndex: number) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 85) {
          progress = 85;
          clearInterval(interval);
        }
        updateOperationProgress(operationIndex, Math.min(progress, 85));
      }, 300);
      return interval;
    },
    [updateOperationProgress]
  );

  // Check if all operations are complete
  useEffect(() => {
    if (operations.every((op) => op.status === "completed")) {
      setAllOperationsComplete(true);
    }
  }, [operations]);

  useEffect(() => {
    let isMounted = true;
    const intervals: NodeJS.Timeout[] = [];

    const fetchData = async () => {
      try {
        // Profile fetch
        setOperations((prev) =>
          prev.map((op, i) => (i === 0 ? { ...op, status: "loading" } : op))
        );
        const profileInterval = simulateProgress(0);
        intervals.push(profileInterval);

        await dispatch(fetchUserProfile()).unwrap();
        if (isMounted) {
          clearInterval(profileInterval);
          updateOperationProgress(0, 100, "completed");
        }

        // Events fetch
        if (isMounted) {
          setOperations((prev) =>
            prev.map((op, i) => (i === 1 ? { ...op, status: "loading" } : op))
          );
          const eventsInterval = simulateProgress(1);
          intervals.push(eventsInterval);

          await dispatch(fetchEvents()).unwrap();
          if (isMounted) {
            clearInterval(eventsInterval);
            updateOperationProgress(1, 100, "completed");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          intervals.forEach(clearInterval);
          toast({
            title: "System Error",
            description:
              "An error occurred while fetching data. Please try again later.",
            duration: 7000,
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setHasAttemptedFetch(true);
        }
      }
    };

    if (userId && !hasAttemptedFetch) {
      fetchData();
    }

    if (!userId && sessionStatus !== "loading") {
      setHasAttemptedFetch(true);
    }

    return () => {
      isMounted = false;
      intervals.forEach(clearInterval);
    };
  }, [
    dispatch,
    userId,
    hasAttemptedFetch,
    sessionStatus,
    simulateProgress,
    updateOperationProgress,
  ]);

  const isLoading =
    sessionStatus === "loading" ||
    (!hasAttemptedFetch && (profileLoading || eventsStatus === "loading")) ||
    (hasAttemptedFetch && !allOperationsComplete);

  const hasError = profileError || eventsError;
  const combinedError = hasError ? profileError || eventsError : null;

  // Check if data is ready
  const isDataReady =
    profile !== null &&
    eventsStatus === "succeeded" &&
    events !== null &&
    allOperationsComplete;

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <h1 className="text-3xl font-bold text-primary">Please Login First</h1>
        <Button>
          <Link href={"/authclient/Login"}>Click here</Link>
        </Button>
      </div>
    );
  }

  if (hasError) {
    return <ErrorState error={combinedError} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <div className="w-64">
          <Progress value={totalProgress} className="h-2" />
        </div>
        <div className="text-sm text-muted-foreground">
          {getLoadingMessage()}
        </div>
        <div className="text-sm font-medium">{totalProgress}%</div>
      </div>
    );
  }

  if (isDataReady) {
    return <>{children}</>;
  }

  return null;
};

export default UnifiedProfileFetch;
