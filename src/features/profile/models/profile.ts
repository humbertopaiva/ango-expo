export interface Profile {
  id: string;
  status: string;
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  empresa: string;
  nome: string;
  descricao: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cor_primaria: string;
  cor_secundaria: string;
  dias_funcionamento: string[];
  opcoes_pagamento: OpcoesPagamento[];
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  linkedin: string;
  adicionais: Adicional[];
  tags: string[];
  imagem_01: string;
  imagem_02: string;
  imagem_03: string;
  imagem_04: string;
  imagem_05: string;
  imagem_06: string;
  logo: string;
  banner: string;
  abertura_segunda: string;
  fechamento_segunda: string;
  abertura_terca: string;
  fechamento_terca: string;
  abertura_quarta: string;
  fechamento_quarta: string;
  abertura_quinta: string;
  fechamento_quinta: string;
  abertura_sexta: string;
  fechamento_sexta: string;
  abertura_sabado: string;
  fechamento_sabado: string;
  abertura_domingo: string;
  fechamento_domingo: string;
  chave_pix: string | null;
  tipo_chave_pix: string | null;
}

export interface DiasFuncionamento {
  dia: string;
  ativo: boolean;
}

export interface OpcoesPagamento {
  tipo: string;
  ativo: boolean;
}

export interface Adicional {
  titulo: string;
  valor: string;
}

export type UpdateProfileDTO = Partial<
  Omit<
    Profile,
    "id" | "user_created" | "date_created" | "user_updated" | "date_updated"
  >
> & {
  logo?: string | null;
  banner?: string | null;
};
