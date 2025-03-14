// src/features/categories/models/category.ts
export interface Category {
  id: string;
  nome: string;
  imagem: string | null;
  status: "published" | "draft";
  empresa: string;
  categoria_ativa: boolean;
  date_created?: string;
  date_updated?: string;
}

export interface CreateCategoryDTO {
  nome: string;
  empresa: string;
  categoria_ativa?: boolean;
}

export interface UpdateCategoryDTO {
  nome?: string;
  categoria_ativa?: boolean;
}
