// Path: src/features/leaflets/schemas/leaflet.schema.ts

import * as z from "zod";

export const leafletFormSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      // Verifica se há pelo menos uma imagem ou um PDF
      const hasImages = [
        data.imagem_01,
        data.imagem_02,
        data.imagem_03,
        data.imagem_04,
        data.imagem_05,
        data.imagem_06,
        data.imagem_07,
        data.imagem_08,
      ].some((image) => image && image.length > 0);

      const hasPdf = data.pdf && data.pdf.length > 0;

      return hasImages || hasPdf;
    },
    {
      message: "O encarte deve ter pelo menos uma imagem ou um arquivo PDF",
      path: ["imagem_01"],
    }
  );

export type LeafletFormData = z.infer<typeof leafletFormSchema>;
