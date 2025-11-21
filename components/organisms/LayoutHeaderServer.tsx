import { LayoutHeaderClient } from "./LayoutHeaderClient";

/**
 * Server Component wrapper for LayoutHeader
 * Fetches current user and passes to client component
 */
export async function LayoutHeaderServer() {
  return <LayoutHeaderClient />;
}
