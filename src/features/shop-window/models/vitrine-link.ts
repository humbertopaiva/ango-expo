// Path: src/features/vitrine/models/vitrine-link.ts
export interface VitrineLink {
  id: string;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  texto: string;
  url: string;
  tipo_link: string;
  ordem: number;
  empresa: {
    id: string;
    status: string;
    sort: number | null;
    user_created: string;
    date_created: string;
    user_updated: string | null;
    date_updated: string | null;
    categoria: string;
    nome: string;
    slug: string;
    usuario: string;
    plano: string;
    segmento: string;
    logo: string | null;
    banner: string | null;
    cor_primaria: string;
    whatsapp: string | null;
    subcategorias: number[];
  };
}

export interface CreateVitrineLinkDTO {
  texto: string;
  url: string;
  tipo_link: string;
  empresa: string;
  ordem?: number;
}

export type UpdateVitrineLinkDTO = Partial<CreateVitrineLinkDTO>;

export interface VitrineLinkFormData {
  texto: string;
  url: string;
  tipo_link: string;
  ordem?: number;
}
