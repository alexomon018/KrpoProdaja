/**
 * User Hooks
 * Hooks for user profiles and user-related operations
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/users";
import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  PaginationParams,
  SendPhoneVerificationRequest,
  VerifyPhoneRequest,
} from "../types";

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      usersService.updateCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: ["users", userId, "profile"],
    queryFn: () => usersService.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserProducts(userId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: ["users", userId, "products", params],
    queryFn: () => usersService.getUserProducts(userId, params),
    enabled: !!userId,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      usersService.changePassword(data),
  });
}

export function useSendPhoneVerification() {
  return useMutation({
    mutationFn: (data: SendPhoneVerificationRequest) =>
      usersService.sendPhoneVerification(data),
  });
}

export function useVerifyPhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPhoneRequest) => usersService.verifyPhone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useResendPhoneVerification() {
  return useMutation({
    mutationFn: () => usersService.resendPhoneVerification(),
  });
}
