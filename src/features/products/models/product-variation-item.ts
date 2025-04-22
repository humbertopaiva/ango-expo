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
  status?: string;
}

export type UpdateProductVariationItemDTO =
  Partial<CreateProductVariationItemDTO>;
