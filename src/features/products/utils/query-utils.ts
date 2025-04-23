// Path: src/features/products/utils/query-utils.ts
import { QueryClient } from "@tanstack/react-query";

/**
 * Utilitário para invalidar queries relacionadas a um produto específico
 * @param queryClient Cliente de consulta do React Query
 * @param productId ID do produto (opcional)
 * @param options Opções de invalidação
 */
export const invalidateProductQueries = async (
  queryClient: QueryClient,
  productId?: string,
  options: {
    invalidateList?: boolean;
    invalidateDetails?: boolean;
    invalidateVariations?: boolean;
    refetch?: boolean;
  } = {
    invalidateList: true,
    invalidateDetails: true,
    invalidateVariations: true,
    refetch: false,
  }
) => {
  const { invalidateList, invalidateDetails, invalidateVariations, refetch } =
    options;

  console.log(
    `Invalidando queries para ${
      productId ? `produto ${productId}` : "todos os produtos"
    }`
  );

  // Arrays para armazenar queries a serem invalidadas
  const queriesToInvalidate = [];

  // Adicionar as queries corretas para invalidação
  if (invalidateList) {
    queriesToInvalidate.push({ queryKey: ["products"] });
  }

  if (productId && invalidateDetails) {
    queriesToInvalidate.push({ queryKey: ["product-details", productId] });
  }

  if (productId && invalidateVariations) {
    queriesToInvalidate.push({
      queryKey: ["product-variation-items", productId],
    });
  }

  // Invalidar todas as queries coletadas
  for (const query of queriesToInvalidate) {
    queryClient.invalidateQueries(query);
  }

  // Força refetch imediato se solicitado
  if (refetch) {
    console.log("Forçando refetch de queries invalidadas");
    const refetchPromises = queriesToInvalidate.map((query) =>
      queryClient.refetchQueries(query)
    );

    // Aguardar todos os refetches completarem
    await Promise.all(refetchPromises);
    console.log("Refetch completo para todas as queries");
  }
};

/**
 * Invalidar queries de variação
 * @param queryClient Cliente de consulta do React Query
 * @param variationId ID da variação (opcional)
 * @param refetch Se deve forçar refetch imediato
 */
export const invalidateVariationQueries = async (
  queryClient: QueryClient,
  variationId?: string,
  refetch: boolean = false
) => {
  console.log(
    `Invalidando queries de variação ${
      variationId ? `para variação ${variationId}` : "para todas as variações"
    }`
  );

  // Queries a invalidar
  const queriesToInvalidate = [];

  // Sempre invalidar a lista de variações
  queriesToInvalidate.push({ queryKey: ["variation-types"] });
  queriesToInvalidate.push({ queryKey: ["company-variations"] });

  // Se um ID específico for fornecido
  if (variationId) {
    queriesToInvalidate.push({ queryKey: ["variation", variationId] });
  }

  // Invalidar todas as queries
  for (const query of queriesToInvalidate) {
    queryClient.invalidateQueries(query);
  }

  // Forçar refetch se solicitado
  if (refetch) {
    const refetchPromises = queriesToInvalidate.map((query) =>
      queryClient.refetchQueries(query)
    );
    await Promise.all(refetchPromises);
  }
};

/**
 * Função auxiliar para agrupar invalidações
 * e otimizar quando múltiplos sistemas estão envolvidos
 */
export const invalidateRelatedQueries = async (
  queryClient: QueryClient,
  options: {
    productId?: string;
    variationId?: string;
    invalidateProducts?: boolean;
    invalidateVariations?: boolean;
    invalidateCategories?: boolean;
    refetch?: boolean;
  } = {
    invalidateProducts: true,
    invalidateVariations: false,
    invalidateCategories: false,
    refetch: false,
  }
) => {
  const {
    productId,
    variationId,
    invalidateProducts,
    invalidateVariations,
    invalidateCategories,
    refetch,
  } = options;

  // Funções a executar em paralelo
  const tasks = [];

  if (invalidateProducts) {
    tasks.push(
      invalidateProductQueries(queryClient, productId, {
        invalidateList: true,
        invalidateDetails: !!productId,
        invalidateVariations: !!productId,
        refetch,
      })
    );
  }

  if (invalidateVariations) {
    tasks.push(invalidateVariationQueries(queryClient, variationId, refetch));
  }

  if (invalidateCategories) {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    if (refetch) {
      tasks.push(queryClient.refetchQueries({ queryKey: ["categories"] }));
    }
  }

  // Executar todas as tarefas em paralelo
  await Promise.all(tasks);
};

/**
 * Mantida por compatibilidade com código existente.
 * @deprecated Use invalidateProductQueries em vez disso
 */
export const invalidateAllProductQueries = (queryClient: QueryClient) => {
  console.warn("Deprecated: Use invalidateProductQueries instead");
  invalidateProductQueries(queryClient, undefined, {
    invalidateList: true,
    invalidateDetails: true,
    invalidateVariations: true,
    refetch: true,
  });
};
