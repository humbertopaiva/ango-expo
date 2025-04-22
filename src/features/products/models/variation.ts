// Path: src/features/products/models/variation.ts

/**
 * Representa um tipo de variação de produto (ex: Tamanho, Cor, etc.)
 */
export interface ProductVariation {
  id: string;
  nome: string;
  variacao: string[]; // Array de valores possíveis para esta variação (ex: ["P", "M", "G"])
  empresa?: string; // ID da empresa a qual esta variação pertence
}

/**
 * DTO para criação de um novo tipo de variação
 */
export interface CreateVariationDTO {
  nome: string;
  variacao: string[]; // Array de valores possíveis
  empresa: string; // ID da empresa
}

/**
 * DTO para atualização de um tipo de variação existente
 */
export type UpdateVariationDTO = Partial<CreateVariationDTO>;
