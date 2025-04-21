// Path: src/features/products/models/variation.ts
export interface ProductVariation {
  id: string;
  nome: string;
  variacao: string[];
  empresa?: string;
}

export interface ProductVariationItem {
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
  preco_promocional?: string;
  imagem?: string | null;
  status?: "disponivel" | "indisponivel";
  empresa?: string;
}

export interface CreateVariationDTO {
  nome: string;
  variacao: string[];
  empresa: string;
}

export interface UpdateVariationDTO {
  nome?: string;
  variacao?: string[];
}

export interface CreateVariationItemDTO {
  produto: string;
  variacao: string;
  valor_variacao: string;
  preco: string;
  preco_promocional?: string | null;
  imagem?: string | null;
  status?: "disponivel" | "indisponivel";
  empresa: string;
}
