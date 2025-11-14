import { UserProfile } from "@/components/organisms/ProfilePage/UserProfile";

/**
 * User Profile Page (Dynamic)
 *
 * View any user's profile by userId
 * Route: /profile/[userId]
 */
export default function UserProfilePage() {
  // Server component
  return <UserProfile />;
}
