"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  memberSince: string;
  verified: boolean;
  rating?: number;
  totalSales?: number;
  activeListing?: number;
}

export interface ProfileViewProps {
  /**
   * Profile data to display
   */
  profile: ProfileData;
  /**
   * Whether this is the current user's profile
   */
  isOwnProfile?: boolean;
  /**
   * Callback when logout is clicked
   */
  onLogout?: () => void;
}

/**
 * ProfileView Component - Atomic Design: Organism
 *
 * Displays user profile with stats and actions
 *
 * @example
 * ```tsx
 * <ProfileView
 *   profile={profileData}
 *   isOwnProfile={true}
 *   onLogout={() => console.log("Logout")}
 * />
 * ```
 */
export function ProfileView({
  profile,
  isOwnProfile = false,
  onLogout,
}: ProfileViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            <Avatar
              src={profile.avatar}
              alt={profile.name}
              size="2xl"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-primary">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <Icon name="BadgeCheck" size={24} className="fill-blue-500 text-white" />
                  )}
                </div>
                {profile.location && (
                  <p className="text-secondary flex items-center gap-1 mt-1">
                    <Icon name="MapPin" size={16} />
                    {profile.location}
                  </p>
                )}
              </div>

              {isOwnProfile && (
                <div className="flex gap-2">
                  <Link href="/profile/edit">
                    <Button variant="secondary" size="sm">
                      <Icon name="Edit" size={16} />
                      Izmeni profil
                    </Button>
                  </Link>
                  <Button variant="secondary" size="icon" onClick={onLogout}>
                    <Icon name="LogOut" size={16} />
                  </Button>
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="text-secondary">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-tertiary" />
                <span className="text-secondary">
                  Član od {new Date(profile.memberSince).toLocaleDateString("sr-RS")}
                </span>
              </div>
              {profile.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={16} className="text-yellow-500" />
                  <span className="text-primary font-medium">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.activeListing ?? 0}
          </div>
          <div className="text-sm text-secondary mt-1">Aktivni oglasi</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.totalSales ?? 0}
          </div>
          <div className="text-sm text-secondary mt-1">Prodato</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.rating?.toFixed(1) ?? "N/A"}
          </div>
          <div className="text-sm text-secondary mt-1">Ocena</div>
        </div>
      </div>

      {/* Contact Info (only for own profile) */}
      {isOwnProfile && (
        <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-primary">Kontakt informacije</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="Mail" size={20} className="text-tertiary" />
              <div>
                <p className="text-sm text-secondary">Email</p>
                <p className="text-primary">{profile.email}</p>
              </div>
            </div>

            {profile.phone && (
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={20} className="text-tertiary" />
                <div>
                  <p className="text-sm text-secondary">Telefon</p>
                  <p className="text-primary">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions for other users */}
      {!isOwnProfile && (
        <div className="flex gap-4">
          <Button variant="primary" fullWidth>
            <Icon name="MessageCircle" size={20} />
            Pošalji poruku
          </Button>
          <Button variant="secondary" fullWidth>
            <Icon name="Eye" size={20} />
            Vidi oglase
          </Button>
        </div>
      )}
    </div>
  );
}
