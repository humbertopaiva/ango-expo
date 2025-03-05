export interface LatestShowcase {
  id: string;
  status: string;
  date_created: string;
  date_updated: string | null;
  empresa: {
    id: string;
    status: string;
    nome: string;
    slug: string;
    logo: string | null;
    banner: string | null;
    cor_primaria: string | null;
    date_updated: string;
  };
}
