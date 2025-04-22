// Path: src/features/products/utils/query-utils.ts
import { QueryClient } from "@tanstack/react-query";

/**
 * Utilitário para invalidar TODAS as queries relacionadas a produtos e variações no sistema
 * @param queryClient Cliente de consulta do React Query
 */
export const invalidateAllProductQueries = (queryClient: QueryClient) => {
  console.log("Invalidando TODAS as queries do sistema");

  // Invalidar todas as queries de produtos com qualquer parâmetro
  queryClient.invalidateQueries({ queryKey: ["products"] });

  // Invalidar todas as queries de detalhes de produtos
  queryClient.invalidateQueries({ queryKey: ["product-details"] });

  // Invalidar todas as queries de variações de produtos
  queryClient.invalidateQueries({ queryKey: ["product-variation-items"] });

  // Invalidar todas as queries de tipos de variação
  queryClient.invalidateQueries({ queryKey: ["variation-types"] });
  queryClient.invalidateQueries({ queryKey: ["company-variations"] });

  // Invalidar dados globais de produtos
  queryClient.invalidateQueries({ queryKey: ["product-for-variation"] });

  // Adicionar invalidação para qualquer outra query do sistema que possa conter
  // dados relacionados a produtos
  queryClient.invalidateQueries({ queryKey: ["categories"] });

  // Força refetch de todas as queries ativas
  queryClient.refetchQueries({ type: "active" });
};
