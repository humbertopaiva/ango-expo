// Path: src/hooks/use-loading.ts
import { useCallback } from "react";
import { useLoading } from "@/src/providers/loading-provider";

export function useLoadingOperation() {
  const { showLoader, hideLoader } = useLoading();

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
