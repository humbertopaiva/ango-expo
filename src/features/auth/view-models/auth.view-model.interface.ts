// src/features/auth/view-models/auth.view-model.interface.ts
import { Profile } from "@/src/features/auth/models/auth";
import { LoginFormData } from "@/src/features/auth/schemas/auth.schema";
import { UseFormReturn } from "react-hook-form";

export interface IAuthViewModel {
  // Estados
  isLoading: boolean;
  isAuthenticated: boolean;

  // Form
  form: UseFormReturn<LoginFormData>;

  // Handlers
  onSubmit: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;

  // Auth Info
  profile: Profile | null;
}
