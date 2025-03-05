export interface Category {
  id: string;
  sort: number;
  nome: string;
  slug: string;
  imagem: string | null;
  date_created: string;
  date_updated: string | null;
}
