// Path: src/features/leaflets-page/models/leaflet.ts
export interface Leaflet {
  id: string;
  status: "ativo" | "inativo";
  date_created: string;
  date_updated: string | null;
  nome: string;
  validade: string;
  banner: string | null;
  imagem_01: string | null;
  imagem_02: string | null;
  imagem_03: string | null;
  imagem_04: string | null;
  imagem_05: string | null;
  imagem_06: string | null;
  imagem_07: string | null;
  imagem_08: string | null;
  pdf?: string | null;
  empresa: {
    nome: string;
    slug: string;
    logo: string;
    categoria: {
      id: string;
      nome: string;
      slug: string;
    };
  };
}

// Interfaces auxiliares para componentes
export interface Company {
  slug: string;
  nome: string;
  logo: string;
}

export interface Category {
  id: string;
  nome: string;
  slug: string;
}
