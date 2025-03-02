// Path: src/features/vitrine/models/vitrine-produto.ts
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
  disponivel?: boolean;
  ordem: string;
  empresa: string;
}

export interface CreateVitrineProdutoDTO {
  produto: string;
  empresa: string;
  disponivel?: boolean;
  ordem?: string;
  sort?: number;
}

export type UpdateVitrineProdutoDTO = Partial<CreateVitrineProdutoDTO>;

export interface VitrineProdutoFormData {
  produto: string;
  disponivel?: boolean;
  ordem?: string;
  sort?: number;
}
