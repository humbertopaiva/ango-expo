// Path: src/features/category-page/models/category-company.ts
export interface CategoryCompany {
  empresa: {
    slug: string;
    categoria: {
      id: string;
      nome: string;
      slug: string;
      imagem: string;
      subcategorias: number[];
    };
    subcategorias: Array<{
      subcategorias_empresas_id: {
        id: string;
        nome: string;
        slug: string;
        imagem: string | null;
        date_updated?: string;
      };
    }>;
  };
  perfil: {
    id: string;
    nome: string;
    status: string;
    logo: string | null;
    banner: string | null;
    cor_primaria: string | null;
    cor_secundaria: string | null;
    abertura_segunda?: string;
    fechamento_segunda?: string;
    abertura_terca?: string;
    fechamento_terca?: string;
    abertura_quarta?: string;
    fechamento_quarta?: string;
    abertura_quinta?: string;
    fechamento_quinta?: string;
    abertura_sexta?: string;
    fechamento_sexta?: string;
    abertura_sabado?: string;
    fechamento_sabado?: string;
    abertura_domingo?: string;
    fechamento_domingo?: string;
    dias_funcionamento?: string[];
    date_updated?: string;
    whatsapp?: string;
    telefone?: string;
    endereco?: string;
    empresa: string;
    opcoes_pagamento?: any;
    adicionais?: string[];
    tags?: string[];
  };
}
