// src/features/categories/schemas/category.schema.ts
import * as z from "zod";

export const categoryFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  imagem: z.string().nullable(),
  categoria_ativa: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
