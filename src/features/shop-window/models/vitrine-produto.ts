// Path: src/features/shop-window/models/vitrine-produto.ts

export interface VitrineProduto {
  id: number;
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  produto: {
    id: string;
    nome: string;
    imagem: string | null;
    descricao: string;
    status: string;
    categoria: number | null;
    preco: string;
    preco_promocional: string | null;
    date_created: string;
    variacao?: {
      id: string;
      nome: string;
    } | null;
    empresa: {
      id: string;
      nome: string;
      slug: string;
      categoria: {
        nome: string;
        slug: string;
      };
    };
  };
  produto_variado?: {
    id: string;
    valor_variacao: string;
    descricao?: string;
    imagem?: string;
    preco: string;
    preco_promocional?: string;
    disponivel?: boolean;
  } | null;
  disponivel?: boolean;
  ordem: string;
  empresa: string;
}

export interface CreateVitrineProdutoDTO {
  produto: string;
  produto_variado?: string | null;
  empresa: string;
  disponivel?: boolean;
  ordem?: string;
  sort?: number;
}

export type UpdateVitrineProdutoDTO = Partial<CreateVitrineProdutoDTO>;

export interface VitrineProdutoFormData {
  produto: string;
  produto_variado?: string | null;
  disponivel?: boolean;
  ordem?: string;
  sort?: number;
}
