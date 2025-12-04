import { UserProfile } from "@/components/organisms/ProfilePage/UserProfile";

/**
 * User Profile Page (Dynamic)
 *
 * View any user's profile by userId
 * Route: /profile/[userId]
 */
export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserProfile userId={userId} />;
}
