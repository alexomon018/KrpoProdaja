import { getCurrentUser } from "@/lib/auth";
import { LayoutHeaderClient } from "./LayoutHeaderClient";

/**
 * Server Component wrapper for LayoutHeader
 * Fetches current user and passes to client component
 */
export async function LayoutHeaderServer() {
  const user = await getCurrentUser();

  return <LayoutHeaderClient user={user} />;
}
