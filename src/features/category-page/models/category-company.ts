// Path: src/features/category-page/models/category-company.ts
export interface CategoryCompany {
  id: string;
  nome: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  subcategorias: Array<{
    subcategorias_empresas_id: {
      id: string;
      nome: string;
      slug: string;
      imagem: string | null;
    };
  }>;
  empresa?: {
    slug?: string;
    categoria?: {
      slug?: string;
    };
  };
}
