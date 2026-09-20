"use client";

import useSWR from "swr";
import { authApi } from "@/lib/api/auth";
import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";
import { useCallback } from "react";

export function useAuth() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<AuthUser>("/auth/me", () => authApi.me(), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000, // 1 minute client deduplication
  });

  const isAuthenticated = !!user && !error;

  const login = useCallback(
    async (credentials: LoginInput): Promise<AuthUser> => {
      const loggedInUser = await authApi.login(credentials);
      await mutate(loggedInUser, false);
      return loggedInUser;
    },
    [mutate]
  );

  const register = useCallback(
    async (data: RegisterInput): Promise<AuthUser> => {
      const registeredUser = await authApi.register(data);
      await mutate(registeredUser, false);
      return registeredUser;
    },
    [mutate]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      await mutate(null as unknown as AuthUser, false);
    }
  }, [mutate]);

  return {
    user: user ?? null,
    error,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    mutate,
  };
}
