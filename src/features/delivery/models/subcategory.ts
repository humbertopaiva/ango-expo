// Path: src/features/delivery/models/subcategory.ts
export interface Subcategory {
  id?: string; // Agora opcional
  nome: string;
  slug: string;
  imagem?: string;
  total_empresas?: number;
}
