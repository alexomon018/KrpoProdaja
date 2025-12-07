"use client";

import { useRouter } from "next/navigation";
import {
  ProfileView,
  ProfileData,
} from "@/components/organisms/ProfileView/ProfileView";
import { Container } from "@/components/atoms/Container/Container";
import { useAuth } from "@/providers/AuthProvider";
import { useUserProfile } from "@/lib/api/hooks/useUsers";
import { Loader } from "@atoms/Icon/Icon";

interface UserProfileProps {
  userId?: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const router = useRouter();
  const { user: currentUser, logout, isLoading: authLoading } = useAuth();

  // Fetch user profile if userId is provided
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(userId || "");

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Determine which user data to display
  const user = userId && profileData ? profileData.user : currentUser;
  const isOwnProfile = !userId || (currentUser?.id === userId) || false;
  const isLoading = userId ? profileLoading : authLoading;

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  if (profileError) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-secondary">
            Nije moguće učitati profil korisnika
          </p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-secondary">
            {userId ? "Korisnik nije pronađen" : "Morate biti prijavljeni da vidite profil"}
          </p>
        </div>
      </Container>
    );
  }

  // Map user from context to ProfileData format
  const profile: ProfileData = {
    id: user.id,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phoneNumber || user.phone,
    avatar: user.avatar,
    bio: user.bio,
    location: user.location,
    memberSince: user.createdAt,
    verified: user?.verifiedSeller ?? false,
    rating: 0, // TODO: Add rating to user API when available
    totalSales: user.soldItems ?? 0,
    activeListing: user.activeListings ?? 0,
  };

  return (
    <Container className="py-8">
      <ProfileView
        profile={profile}
        isOwnProfile={isOwnProfile}
        onLogout={handleLogout}
      />
    </Container>
  );
}
