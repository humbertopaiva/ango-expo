// Path: src/features/company-page/models/custom-product.ts

export interface CustomProduct {
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
  produtos: CustomProductStepItem[];
}

export interface CustomProductStepItem {
  produtos: {
    key: string;
    collection: string;
  };
}
