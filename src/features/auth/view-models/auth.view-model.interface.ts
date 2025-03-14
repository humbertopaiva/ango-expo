// Path: src/features/auth/view-models/auth.view-model.interface.ts
import { Profile } from "@/src/features/auth/models/auth";
import { LoginFormData } from "@/src/features/auth/schemas/auth.schema";
import { ResetPasswordFormData } from "@/src/features/auth/schemas/reset-password.schema";
import { UseFormReturn } from "react-hook-form";

export interface IAuthViewModel {
  // Estados
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  resetSuccess: boolean;

  // Forms
  form: UseFormReturn<LoginFormData>;
  resetPasswordForm: UseFormReturn<ResetPasswordFormData>;

  // Handlers
  onSubmit: (data: LoginFormData) => Promise<void>;
  onResetPassword: (data: ResetPasswordFormData) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
  clearResetSuccess: () => void;

  // Auth Info
  profile: Profile | null;
}
