// Path: src/features/auth/view-models/auth.view-model.ts
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { IAuthViewModel } from "./auth.view-model.interface";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";

import {
  LoginFormData,
  loginSchema,
} from "@/src/features/auth/schemas/auth.schema";

import useAuthStore from "@/src/stores/auth";
import { authService } from "../services/auth.service";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "../schemas/reset-password.schema";

export function useAuthViewModel(): IAuthViewModel {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { profile, setAuth, clearAuth } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const toast = useToast();

  // Form setup
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset password form setup
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const clearResetSuccess = useCallback(() => {
    setResetSuccess(false);
  }, []);

  // Handlers
  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        setIsLoading(true);
        clearAuthError();

        // Adiciona um pequeno delay para tornar a animação do botão perceptível
        await new Promise((resolve) => setTimeout(resolve, 500));

        const profile = await authService.login(data);
        setAuth(profile);

        // Feedback tátil de sucesso
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Exibir toast de sucesso
        toastUtils.success(toast, "Login realizado com sucesso!");

        // Pequeno delay antes de redirecionar para a dashboard
        setTimeout(() => {
          router.replace("/(drawer)/admin/dashboard");
        }, 300);
      } catch (error: unknown) {
        // Tratamento de erro amigável
        console.error(error);

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // Mensagens de erro mais amigáveis
        let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";

        if (error instanceof Error) {
          // Se for um objeto Error, podemos acessar a propriedade message com segurança
          if (error.message.includes("Invalid login credentials")) {
            errorMessage =
              "Email ou senha incorretos. Por favor, tente novamente.";
          } else if (error.message.includes("network")) {
            errorMessage =
              "Falha na conexão. Verifique sua internet e tente novamente.";
          } else {
            errorMessage = error.message;
          }
        }

        setAuthError(errorMessage);

        // Exibir toast de erro
        toastUtils.error(toast, errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [clearAuthError, toast]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      clearAuth();

      // Exibir toast de sucesso
      toastUtils.success(toast, "Logout realizado com sucesso!");

      router.replace("/(drawer)/(auth)/login");
    } catch (error: unknown) {
      console.error(error);

      let errorMessage = "Ocorreu um erro ao fazer logout.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAuthError(errorMessage);

      // Exibir toast de erro
      toastUtils.error(toast, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const onResetPassword = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        setIsLoading(true);
        clearAuthError();

        // Adiciona um pequeno delay para tornar a animação do botão perceptível
        await new Promise((resolve) => setTimeout(resolve, 500));

        await authService.requestPasswordReset(data.email);

        // Feedback tátil de sucesso
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Indica sucesso
        setResetSuccess(true);

        // Exibir toast de sucesso
        toastUtils.success(
          toast,
          "Instruções de recuperação enviadas para seu e-mail!"
        );
      } catch (error: unknown) {
        console.error(error);

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // Mensagens de erro mais amigáveis
        let errorMessage = "Ocorreu um erro ao solicitar redefinição de senha.";

        if (error instanceof Error) {
          if (error.message.includes("network")) {
            errorMessage =
              "Falha na conexão. Verifique sua internet e tente novamente.";
          } else {
            errorMessage = error.message;
          }
        }

        setAuthError(errorMessage);
        toastUtils.error(toast, errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [clearAuthError, toast]
  );

  return {
    isLoading,
    isAuthenticated,
    authError,
    resetSuccess,
    form,
    resetPasswordForm,
    onSubmit,
    onResetPassword,
    logout,
    clearAuthError,
    clearResetSuccess,
    profile,
  };
}
