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
