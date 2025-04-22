// Path: src/utils/query-utils.ts
import { QueryClient } from "@tanstack/react-query";

/**
 * Utilitário para invalidar todas as queries relacionadas a produtos e variações
 * @param queryClient Cliente de consulta do React Query
 * @param productId ID do produto específico (opcional)
 */
export const invalidateProductQueries = (
  queryClient: QueryClient,
  productId?: string
) => {
  // Invalidar todas as queries de produtos
  queryClient.invalidateQueries({ queryKey: ["products"] });

  // Se um ID de produto específico for fornecido, invalidar suas queries específicas
  if (productId) {
    // Invalidar as queries de detalhes do produto
    queryClient.invalidateQueries({ queryKey: ["product-details", productId] });

    // Invalidar as queries de variações do produto
    queryClient.invalidateQueries({
      queryKey: ["product-variation-items", productId],
    });
  } else {
    // Caso contrário, invalidar todas as queries de detalhes de produtos
    queryClient.invalidateQueries({ queryKey: ["product-details"] });

    // E todas as queries de variações
    queryClient.invalidateQueries({ queryKey: ["product-variation-items"] });
  }

  // Invalidar todas as queries de tipos de variação
  queryClient.invalidateQueries({ queryKey: ["variation-types"] });
  queryClient.invalidateQueries({ queryKey: ["company-variations"] });
};
