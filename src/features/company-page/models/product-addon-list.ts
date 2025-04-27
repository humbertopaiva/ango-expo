// Path: src/features/company-page/models/product-addon-list.ts

export interface ProductAddonList {
  id: string;
  status: string;
  date_created: string;
  date_updated: string | null;
  nome: string;
  empresa: string;
  produtos: AddonProduct[];
  categorias: AddonCategory[];
}

export interface AddonProduct {
  id: number;
  lista_adicionais_id: string;
  produtos_id: {
    id: string;
    status: string;
    sort: number | null;
    date_created: string;
    date_updated: string;
    nome: string;
    descricao: string;
    preco: string | null;
    preco_promocional: string | null;
    estoque: number | null;
    video: string | null;
    categoria: number;
    promocao: string | null;
    empresa: string;
    imagem: string | null;
    parcelamento_cartao: boolean;
    quantidade_parcelas: string | null;
    parcelas_sem_juros: boolean;
    desconto_avista: number;
    preco_parcelado_tipo: string;
    tem_variacao: boolean;
    variacao: string | null;
    exibir_preco: boolean | null;
    exibir_produto: boolean;
    quantidade_maxima_carrinho: number | null;
  };
}

export interface AddonCategory {
  id: number;
  lista_adicionais_id: string;
  categorias_produto_id: {
    id: number;
    date_created: string;
    date_updated: string | null;
    nome: string;
    imagem: string | null;
    empresa: string;
    categoria_ativa: boolean;
  };
}
