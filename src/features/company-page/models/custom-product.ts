// Path: src/features/company-page/models/custom-product-detail.ts
export interface CustomProductDetail {
  id: string;
  status: string;
  date_created: string;
  date_updated: string;
  nome: string;
  descricao: string;
  imagem: string | null;
  passos: CustomProductStep[];
  empresa: string;
  preco_tipo: string | null;
  preco: string | null;
}

export interface CustomProductStep {
  passo_numero: number;
  qtd_items_step: number;
  nome?: string;
  descricao?: string;
  produtos: CustomProductItem[];
  quantidade_minima_itens?: number | null;
}

export interface CustomProductItem {
  produtos: {
    key: string;
    collection: string;
  };
  produto_detalhes: {
    id: string;
    status: string;
    nome: string;
    descricao: string;
    preco: string | null;
    preco_promocional: string | null;
    imagem: string | null;
    tem_variacao: boolean;
    variacao: string | null;
    [key: string]: any;
  };
}

export interface CustomProductSelection {
  stepNumber: number;
  selectedItems: CustomProductItem[];
}
