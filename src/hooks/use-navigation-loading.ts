// Path: src/hooks/use-navigation-loading.ts
import { useCallback } from "react";
import { router } from "expo-router";
import { useNavigationLoading } from "@/src/providers/navigation-loading-provider";

export function useNavigateWithLoading() {
  const { startNavigationLoading, stopNavigationLoading } =
    useNavigationLoading();

  const navigateWithLoading = useCallback(
    async (path: string) => {
      try {
        startNavigationLoading();

        // Pequeno delay para garantir que o indicador de progresso seja exibido
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Navegação para a nova rota
        router.push(path as any);
      } catch (error) {
        console.error("Erro na navegação:", error);
        stopNavigationLoading();
      }
    },
    [startNavigationLoading, stopNavigationLoading]
  );

  return navigateWithLoading;
}
