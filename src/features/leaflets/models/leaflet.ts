// src/features/leaflets/models/leaflet.ts

export interface Leaflet {
  id: string;
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  empresa: string;
  nome: string;
  validade: string;
  status: "ativo" | "inativo";
  imagem_01: string | null;
  imagem_02: string | null;
  imagem_03: string | null;
  imagem_04: string | null;
  imagem_05: string | null;
  imagem_06: string | null;
  imagem_07: string | null;
  imagem_08: string | null;
  banner: string | null;
  pdf?: string | null;
}

export interface CreateLeafletDTO {
  nome: string;
  validade: string;
  empresa: string;
  status?: "ativo" | "inativo";
  imagem_01?: string | null;
  imagem_02?: string | null;
  imagem_03?: string | null;
  imagem_04?: string | null;
  imagem_05?: string | null;
  imagem_06?: string | null;
  imagem_07?: string | null;
  imagem_08?: string | null;
  banner?: string | null;
  sort?: number | null;
  pdf?: string | null;
}

export type UpdateLeafletDTO = Partial<CreateLeafletDTO>;
