import { ZodNull } from "zod";

export interface ProductVariation {
  id: string;
  produto: {
    id: string;
    nome: string;
  };
  variacao: {
    id: string;
    nome: string;
  };
  valor_variacao: string;
  preco?: string;
  preco_promocional?: string | null;
  imagem?: string | null;
  status?: "disponivel" | "indisponivel";
}

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
  tem_variacao: boolean;
  variacao?: string | { id: string; nome: string; variacao: string[] };
  produto_variado?: ProductVariation[];
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
  tem_variacao: boolean;
  variacao?: string;
}

export interface ProductVariationDTO {
  produto: string;
  variacao: string;
  valor_variacao: string;
  preco: string;
  preco_promocional?: string | null;
  imagem?: string | null;
  status?: "disponivel" | "indisponivel";
  empresa: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
