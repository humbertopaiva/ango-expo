// Path: src/features/products/models/product.ts
export interface Product {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  nome: string;
  descricao: string;
  preco: string | null;
  preco_promocional: string | null;
  categoria: { id: number; nome: string } | number | null;
  empresa: string | { nome: string; slug: string };
  imagem: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas: string | null;
  parcelas_sem_juros: boolean;
  desconto_avista: number;
  status: "disponivel" | "indisponivel";
  variacao: string | { id: string; nome: string } | null;
  quantidade_maxima_carrinho: number | null;
  exibir_produto: boolean;
  exibir_preco: boolean;
}

export interface CreateProductDTO {
  nome: string;
  descricao?: string;
  preco?: string | null;
  preco_promocional?: string | null;
  categoria: number | null;
  empresa: string;
  imagem?: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas?: string | null;
  parcelas_sem_juros: boolean;
  desconto_avista: number;
  status?: "disponivel" | "indisponivel";
  variacao: string | null;
  quantidade_maxima_carrinho?: number | null;
  exibir_produto?: boolean;
  exibir_preco?: boolean;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
