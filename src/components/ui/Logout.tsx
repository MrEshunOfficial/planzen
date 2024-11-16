import { LogOut } from "lucide-react";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";

const Logout = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    startTransition(async () => {
      try {
        // Clear client-side storage
        if (typeof window !== "undefined") {
          window.sessionStorage.clear();
          localStorage.removeItem("next-auth.session-token");
          localStorage.removeItem("next-auth.callback-url");
          localStorage.removeItem("next-auth.csrf-token");
        }

        // Perform the siglost
        await signOut({
          redirect: true,
          callbackUrl: "/authclient/Login",
        });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoggingOut(false);
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      className="w-full"
    >
      <Button
        type="submit"
        variant="ghost"
        disabled={isPending || isLoggingOut}
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogOut size={18} className="mr-2" />
        {isPending || isLoggingOut ? "Logging out..." : "Log Out"}
      </Button>
    </form>
  );
};

export default Logout;
