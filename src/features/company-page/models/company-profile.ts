// src/features/company-page/models/company-profile.ts
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
  opcoes_pagamento: Array<{
    tipo: string;
    ativo: boolean;
  }>;
  adicionais: string[];
  tags: string[];
  logo: string | null;
  banner: string | null;
  descricao: string;
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
