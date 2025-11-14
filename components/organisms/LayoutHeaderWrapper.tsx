import { getCurrentUser } from "@/lib/auth";
import { LayoutHeaderClient } from "./LayoutHeaderClient";

/**
 * Server component that renders the header with current user
 * Note: Auth pages should use their own layout that doesn't include this component
 */
export async function LayoutHeaderWrapper() {
  // Fetch current user
  const user = await getCurrentUser();

  return <LayoutHeaderClient user={user} />;
}
