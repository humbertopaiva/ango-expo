// Path: src/features/custom-products/models/custom-product.ts
export interface CustomProduct {
  id: string;
  nome: string;
  descricao: string;
  imagem: string | null;
  empresa: string;
  status: "ativo" | "desativado";
  date_created?: string;
  date_updated?: string;
  passos: CustomProductStep[];
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

export interface CreateCustomProductDTO {
  nome: string;
  descricao: string;
  imagem?: string | null;
  empresa: string;
  status?: "ativo" | "desativado";
  passos: CustomProductStep[];
}

export interface UpdateCustomProductDTO {
  nome?: string;
  descricao?: string;
  imagem?: string | null;
  empresa?: string;
  status?: "ativo" | "desativado";
  passos?: CustomProductStep[];
}
