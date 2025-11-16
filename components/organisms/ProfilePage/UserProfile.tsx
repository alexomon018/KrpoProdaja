"use client";

import { useRouter } from "next/navigation";
import {
  ProfileView,
  ProfileData,
} from "@/components/organisms/ProfileView/ProfileView";
import { Container } from "@/components/atoms/Container/Container";
import { useAuth } from "@/lib/auth/context";

export function UserProfile() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (isLoading) {
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

  if (!user) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-secondary">
            Morate biti prijavljeni da vidite profil
          </p>
        </div>
      </Container>
    );
  }

  // Map user from context to ProfileData format
  const profile: ProfileData = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}` || user.username,
    email: user.email,
    phone: user.phoneNumber,
    avatar: user.avatar,
    bio: user.bio,
    location: user.location,
    memberSince: user.createdAt,
    verified: true,
    rating: 0, // TODO: Add rating to user API
    totalSales: 0, // TODO: Add stats to user API
    activeListing: 0, // TODO: Add stats to user API
  };

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
