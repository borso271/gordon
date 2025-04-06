import { useMemo } from "react";

export function useUser() {
  // Simulate a logged-in user
  const user = useMemo(() => {
    return {
      id: "abc", // replace with real user id later
      email: "demo@example.com",
      name: "Demo User",
    };
  }, []);

  return { user };
}
