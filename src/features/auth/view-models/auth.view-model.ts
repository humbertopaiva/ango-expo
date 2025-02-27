// src/features/auth/view-models/auth.view-model.ts
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { IAuthViewModel } from "./auth.view-model.interface";

import {
  LoginFormData,
  loginSchema,
} from "@/src/features/auth/schemas/auth.schema";

import useAuthStore from "@/src/stores/auth";
import { authService } from "../services/auth.service";

export function useAuthViewModel(): IAuthViewModel {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, setAuth, clearAuth } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  // Form setup
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handlers
  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const profile = await authService.login(data);
      setAuth(profile);
      router.replace("/(drawer)/admin/dashboard");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      clearAuth();
      router.replace("/(drawer)/(auth)/login");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isAuthenticated,
    form,
    onSubmit,
    logout,
    profile,
  };
}
