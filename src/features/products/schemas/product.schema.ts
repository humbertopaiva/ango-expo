import * as z from "zod";

export const productFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  preco: z.string().min(1, "Preço é obrigatório"),
  preco_promocional: z.string().nullable(),
  categoria: z.coerce.number(),
  imagem: z.string().nullable(),
  parcelamento_cartao: z.boolean().default(false),
  parcelas_sem_juros: z.boolean().default(false),
  quantidade_parcelas: z.string().nullable().optional(),
  desconto_avista: z.coerce
    .number()
    .min(0)
    .max(100, "Desconto não pode ser maior que 100%")
    .default(0),
  preco_parcelado_tipo: z.string().nullable(),
  status: z.enum(["disponivel", "indisponivel"]).default("disponivel"),
  sort: z.coerce.number().nullable(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
