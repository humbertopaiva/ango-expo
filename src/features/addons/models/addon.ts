// Path: src/features/addons/models/addon.ts
export interface AddonCategory {
  id: number;
  lista_adicionais_id?: string;
  categorias_produto_id: {
    id: number;
    nome: string;
    imagem: string | null;
    empresa: string;
    categoria_ativa: boolean;
  };
}

export interface AddonProduct {
  id: number;
  lista_adicionais_id?: string;
  produtos_id: {
    id: string;
    nome: string;
    descricao: string;
    preco: string | null;
    preco_promocional: string | null;
    imagem: string | null;
    categoria: number;
    empresa: string;
    status: string;
    tem_variacao: boolean;
    variacao: string | null;
  };
}

export interface AddonsList {
  id: string;
  nome: string;
  empresa: string;
  status?: string;
  date_created?: string;
  date_updated?: string;
  produtos: AddonProduct[];
  categorias: AddonCategory[];
}

export interface CreateAddonsListDTO {
  nome: string;
  empresa: string;
  produtos?: { produtos_id: string }[];
  categorias?: { categorias_produto_id: number }[];
}

export interface UpdateAddonsListDTO {
  nome?: string;
  empresa?: string;
  produtos?: { produtos_id: string }[];
  categorias?: { categorias_produto_id: number }[];
}
