// Path: src/hooks/use-loading-operation.ts
import { useCallback } from "react";
import { useLoading } from "@/src/providers/loading-provider";

/**
 * Hook para facilitar o uso do loading em operações assíncronas
 */
export function useLoadingOperation() {
  const { showLoader, hideLoader } = useLoading();

  /**
   * Executa uma função assíncrona com o loader sendo exibido
   */
  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        showLoader();
        return await fn();
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  return {
    showLoader,
    hideLoader,
    withLoading,
  };
}
