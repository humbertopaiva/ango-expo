// Path: src/features/products/schemas/product.schema.ts
import * as z from "zod";

export const productFormSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória").optional(),
    preco: z.string().min(1, "Preço é obrigatório").optional(),
    preco_promocional: z.string().nullable().optional(),
    // Aceitando que categoria pode ser 0, que será tratado como null ao ser enviado para API
    categoria: z.coerce
      .number()
      .default(0)
      .transform((val) => (val === 0 ? null : val)), // Transforma 0 em null
    imagem: z.string().nullable().optional(),
    parcelamento_cartao: z.boolean().default(false),
    quantidade_parcelas: z
      .string()
      .nullable()
      .optional()
      .transform((val) => (val === "" ? null : val)), // Tratando string vazia como null
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
    status: z
      .enum(["disponivel", "indisponivel"])
      .default("disponivel")
      .optional(),
    tem_variacao: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Se tem_variacao é false, então preco e descricao são obrigatórios
      if (!data.tem_variacao) {
        return !!data.preco && !!data.descricao;
      }
      return true;
    },
    {
      message: "Preço e descrição são obrigatórios para produtos sem variação",
      path: ["preco"], // Mostra o erro no campo de preço
    }
  );

export type ProductFormData = z.infer<typeof productFormSchema>;
