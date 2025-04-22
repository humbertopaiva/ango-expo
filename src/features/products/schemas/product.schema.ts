// Path: src/features/products/schemas/product.schema.ts
import * as z from "zod";

export const productFormSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().nullable().optional(),
    preco: z.string().nullable().optional(),
    preco_promocional: z.string().nullable().optional(),
    categoria: z.coerce
      .number()
      .default(0)
      .transform((val) => (val === 0 ? null : val)),
    imagem: z.string().nullable().optional(),
    parcelamento_cartao: z.boolean().default(false),
    quantidade_parcelas: z
      .string()
      .nullable()
      .optional()
      .transform((val) => (val === "" ? null : val)),
    desconto_avista: z.preprocess(
      (val) =>
        val === null || val === undefined || val === "" ? 0 : Number(val),
      z
        .number()
        .min(0, "Desconto não pode ser negativo")
        .max(100, "Desconto não pode ser maior que 100%")
    ),
    status: z
      .enum(["disponivel", "indisponivel"])
      .default("disponivel")
      .optional(),
    // Removendo tem_variacao e adicionando variacao
    variacao: z.string().nullable().optional(),
    // Campo temporário para controle no frontend
    is_variacao_enabled: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Se is_variacao_enabled é false, então preco e descricao são obrigatórios
      if (!data.is_variacao_enabled) {
        return !!data.preco && !!data.descricao;
      }
      return true; // Se is_variacao_enabled é true, não exigimos preço nem descrição
    },
    {
      message: "Preço e descrição são obrigatórios para produtos sem variação",
      path: ["preco"],
    }
  );

export type ProductFormData = z.infer<typeof productFormSchema>;
