export interface Leaflet {
  id: string;
  status: string;
  nome: string;
  validade: string;
  empresa: {
    id: string;
    nome: string;
    slug: string;
  };
  imagem_01: string | null;
  banner: string | null;
  date_created: string;
  pdf?: string;
}
