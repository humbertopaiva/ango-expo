// Path: src/features/products/schemas/product.schema.ts
import * as z from "zod";

export const productFormSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    preco: z.string().nullable().optional(),
    preco_promocional: z.string().nullable().optional(),
    // Aceitando que categoria pode ser 0, que será tratado como null ao ser enviado para API
    categoria: z.coerce
      .number()
      .default(0)
      .transform((val) => (val === 0 ? null : val)), // Transforma 0 em null
    imagem: z.string().nullable().optional(),
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
    tem_variacao: z.boolean().default(false),
    variacao: z.string().nullable().optional(),
    // Array de variações de produto para quando tem_variacao = true
    variacoes_produtos: z
      .array(
        z.object({
          id: z.string().optional(),
          valor_variacao: z.string(),
          preco: z.string().min(1, "Preço é obrigatório"),
          preco_promocional: z.string().nullable().optional(),
          imagem: z.string().nullable().optional(),
          status: z.enum(["disponivel", "indisponivel"]).default("disponivel"),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Se tem_variacao é true, requer variacao e variacoes_produtos
      if (data.tem_variacao) {
        return (
          !!data.variacao &&
          Array.isArray(data.variacoes_produtos) &&
          data.variacoes_produtos.length > 0
        );
      }
      // Se tem_variacao é false, requer preco
      return !!data.preco;
    },
    {
      message: "Campos obrigatórios não preenchidos",
      path: ["variacao"], // Mensagem vai aparecer no campo variacao
    }
  );

export type ProductFormData = z.infer<typeof productFormSchema>;
