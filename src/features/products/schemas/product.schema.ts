// src/features/products/schemas/product.schema.ts
import * as z from "zod";

export const productFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  preco: z.string().min(1, "Preço é obrigatório"),
  preco_promocional: z.string().nullable(),
  // Aceitando que categoria pode ser 0, que será tratado como null ao ser enviado para API
  categoria: z.coerce.number(),
  imagem: z.string().nullable(),
  parcelamento_cartao: z.boolean().default(false),
  parcelas_sem_juros: z.boolean().default(false),
  quantidade_parcelas: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)), // Tratando string vazia como null
  estoque: z.number().nullable().optional(),
  desconto_avista: z.preprocess(
    // Converter para número, usando 0 como fallback para null ou undefined
    (val) =>
      val === null || val === undefined || val === "" ? 0 : Number(val),
    // Validar como número entre 0 e 100
    z
      .number()
      .min(0, "Desconto não pode ser negativo")
      .max(100, "Desconto não pode ser maior que 100%")
  ),
  status: z.enum(["disponivel", "indisponivel"]).default("disponivel"),
  preco_parcelado_tipo: z.string().nullable().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
