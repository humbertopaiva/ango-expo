// Path: src/features/products/models/variation.ts
export interface ProductVariation {
  id: string;
  nome: string;
  variacao: string[];
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
}

export interface CreateVariationDTO {
  nome: string;
  variacao: string[];
}

export interface UpdateVariationDTO {
  nome?: string;
  variacao?: string[];
}

export interface CreateVariationItemDTO {
  produto: string;
  variacao: string;
  valor_variacao: string;
}

export interface UpdateVariationItemDTO {
  produto?: string;
  variacao?: string;
  valor_variacao?: string;
}
