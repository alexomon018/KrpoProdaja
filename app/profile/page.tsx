"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProfileView, ProfileData } from "@/components/organisms/ProfileView/ProfileView";
import { Container } from "@/components/atoms/Container/Container";

/**
 * Profile Page
 *
 * View user profile with stats and information
 */
export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<ProfileData | null>(null);

  React.useEffect(() => {
    // TODO: Fetch profile data from backend
    const fetchProfile = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data
        const mockProfile: ProfileData = {
          id: "1",
          name: "Marko Marković",
          email: "marko@example.com",
          phone: "+381 60 123 4567",
          avatar: undefined,
          bio: "Ljubitelj tehnologije i dobrih kupovina. Prodajem kvalitetne polovne stvari.",
          location: "Beograd, Srbija",
          memberSince: "2024-01-15T00:00:00.000Z",
          verified: true,
          rating: 4.8,
          totalSales: 23,
          activeListing: 5,
        };

        setProfile(mockProfile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // TODO: Implement logout
      console.log("Logging out...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to home
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <svg
            className="animate-spin h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-secondary">Profil nije pronađen</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <ProfileView
        profile={profile}
        isOwnProfile={true}
        onLogout={handleLogout}
      />
    </Container>
  );
}
