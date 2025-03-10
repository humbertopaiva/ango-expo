// Path: src/features/company-page/models/company-profile.ts
export interface CompanyProfile {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cor_primaria: string;
  cor_secundaria: string;
  dias_funcionamento: string[];
  horario_funcionamento?: {
    abertura: string; // Formato "HH:MM"
    fechamento: string; // Formato "HH:MM"
  };
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
  opcoes_pagamento: Array<{
    tipo: string;
    ativo: boolean;
  }>;
  adicionais: string[];
  tags: string[];
  logo: string | null;
  banner: string | null;
  descricao: string;
  instagram?: string;
  facebook?: string;
  empresa: {
    slug: string;
    categoria: {
      nome: string;
      slug: string;
    };
    plano: {
      nome: string;
    };
    subcategorias: Array<{
      subcategorias_empresas_id: {
        id: string;
        nome: string;
        slug: string;
        imagem: string | null;
      };
    }>;
  };
}
