export interface Product {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  nome: string;
  descricao: string;
  preco: string;
  preco_promocional: string | null;
  estoque: number;
  video: string | null;
  categoria: number;
  empresa: string;
  imagem: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas: string | null;
  parcelas_sem_juros: boolean;
  desconto_avista: number;
  preco_parcelado_tipo: string | null;
  status: "disponivel" | "indisponivel";
}

export interface CreateProductDTO {
  nome: string;
  descricao: string;
  preco: string;
  preco_promocional?: string | null;
  video?: string | null;
  categoria: number;
  empresa: string;
  imagem?: string | null;
  parcelamento_cartao: boolean;
  quantidade_parcelas?: string | null;
  parcelas_sem_juros: boolean;
  desconto_avista: number;
  preco_parcelado_tipo?: string | null;
  status?: "disponivel" | "indisponivel";
  estoque?: number | null;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
