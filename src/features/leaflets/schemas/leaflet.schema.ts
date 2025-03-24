// Path: src/features/leaflets/schemas/leaflet.schema.ts

import * as z from "zod";

export const leafletFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  validade: z.string().min(1, "Data de validade é obrigatória"),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
  banner: z.string().nullable(),
  imagem_01: z.string().nullable(),
  imagem_02: z.string().nullable(),
  imagem_03: z.string().nullable(),
  imagem_04: z.string().nullable(),
  imagem_05: z.string().nullable(),
  imagem_06: z.string().nullable(),
  imagem_07: z.string().nullable(),
  imagem_08: z.string().nullable(),
  pdf: z.string().nullable(),
});

export type LeafletFormData = z.infer<typeof leafletFormSchema>;
