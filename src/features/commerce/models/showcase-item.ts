// Path: src/features/commerce/models/showcase-item.ts
export interface ShowcaseItem {
  id: string;
  nome: string;
  imagem: string | null;
  preco: string;
  descricao: string;
  preco_promocional: string | null;
  date_created: string;
  ordem_vitrine?: number;
  disponivel?: boolean;
  parcelamento_cartao?: boolean;
  quantidade_parcelas?: number | null;
  parcelas_sem_juros?: boolean;
  preco_parcelado_tipo?: string;
  desconto_avista?: string | null;
  produto_variado?: {
    id: string;
    valor_variacao: string;
    descricao?: string;
    imagem?: string | null;
    preco: string;
    preco_promocional?: string | null;
    disponivel?: boolean;
  } | null;
  empresa: {
    nome: string;
    slug: string;
    cor_primaria: string | null;
    subcategorias?: Array<{
      subcategorias_empresas_id: {
        id: string;
        nome: string;
        slug: string;
      };
    }>;
  };
}
