// Path: src/features/products/models/product-variation-item.ts
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
  status?: string;
  preco?: string;
  preco_promocional?: string;
  estoque?: number;
  imagem?: string;
  descricao?: string;
  disponivel?: boolean;
  quantidade_maxima_carrinho?: number | null;
  exibir_produto?: boolean;
  exibir_preco?: boolean;
}

export interface CreateProductVariationItemDTO {
  produto: string;
  variacao: string;
  valor_variacao: string;
  empresa: string;
  preco?: string;
  preco_promocional?: string;
  estoque?: number;
  imagem?: string;
  descricao?: string;
  disponivel?: boolean;
  status?: string;
  quantidade_maxima_carrinho?: number | null;
  exibir_produto?: boolean;
  exibir_preco?: boolean;
}

export type UpdateProductVariationItemDTO =
  Partial<CreateProductVariationItemDTO>;
