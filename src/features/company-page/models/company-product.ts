// src/features/company-page/models/company-product.ts
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
  categoria?: {
    id: string;
    nome: string;
    slug: string;
  };
  empresa: {
    nome: string;
    slug: string;
  };
}
