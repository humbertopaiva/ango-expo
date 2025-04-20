import { ZodNull } from "zod";

export interface Product {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  nome: string;
  descricao: string;
  preco: string;
  preco_promocional: string | null;
  estoque: number;
  video: string | null;
  categoria: { id: number; nome: string } | number | null;
  empresa: string | { nome: string; slug: string };
  imagem: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas: string | null;
  parcelas_sem_juros: boolean;
  desconto_avista: number;
  preco_parcelado_tipo: string | null;
  status: "disponivel" | "indisponivel";
  hasVariation?: boolean;
}

export interface CreateProductDTO {
  nome: string;
  descricao: string;
  preco: string;
  preco_promocional?: string | null;
  video?: string | null;
  categoria: number | null;
  empresa: string;
  imagem?: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas?: string | null;
  parcelas_sem_juros: boolean;
  desconto_avista: number;
  preco_parcelado_tipo?: string | null;
  status?: "disponivel" | "indisponivel";
  estoque?: number | null;
  hasVariation?: boolean;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
