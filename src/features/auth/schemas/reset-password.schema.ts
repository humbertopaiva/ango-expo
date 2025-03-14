// Path: src/features/auth/schemas/reset-password.schema.ts
import * as z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
