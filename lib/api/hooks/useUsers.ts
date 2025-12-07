/**
 * User Hooks
 * Hooks for user profiles and user-related operations
 */

"use client";

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { usersService } from "../services/users";
import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  SendPhoneVerificationRequest,
  VerifyPhoneRequest,
  UserProductFilters,
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

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["users", userId, "profile"],
    queryFn: () => usersService.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserProducts(
  userId: string,
  filters?: Omit<UserProductFilters, 'page' | 'limit'>,
  limit: number = 20
) {
  return useInfiniteQuery({
    queryKey: ["users", userId, "products", filters],
    queryFn: ({ pageParam = 1 }) =>
      usersService.getUserProducts(userId, { ...filters, page: pageParam, limit }),
    enabled: !!userId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
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
