// Path: src/features/company-page/models/company-product.ts

export interface CompanyProduct {
  id: string;
  nome: string;
  imagem: string | null;
  preco: string;
  descricao: string | null;
  preco_promocional: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas: string | null;
  parcelas_sem_juros: boolean;
  preco_parcelado_tipo: string;
  desconto_avista: number | null;
  // Novos campos para produtos com variação
  tem_variacao: boolean;
  variacao: ProductVariation | null;
  exibir_preco: boolean;
  exibir_produto: boolean;
  quantidade_maxima_carrinho: number | null;
  categoria?: {
    id: string | number;
    nome: string;
    slug?: string;
    imagem?: string;
  };
  empresa: {
    nome: string;
    slug: string;
  };
}

// Interface para as informações de variação
export interface ProductVariation {
  id: string;
  status: string;
  date_created: string;
  date_updated: string | null;
  variacao: string[];
  nome: string;
  empresa: string;
}

// Interface para produtos com variação selecionada (para uso no carrinho)
export interface ProductWithVariation extends CompanyProduct {
  produto_variado?: {
    id?: string;
    valor_variacao?: string;
    preco?: string;
    preco_promocional?: string;
    descricao?: string;
    imagem?: string | null;
    disponivel?: boolean;
  };
}