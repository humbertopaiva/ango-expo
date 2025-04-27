// Path: src/features/company-page/hooks/use-product-addons.ts

import { useState, useEffect } from "react";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ProductAddonList } from "../models/product-addon-list";

export function useProductAddons(productId: string) {
  const [addonLists, setAddonLists] = useState<ProductAddonList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const vm = useCompanyPageContext();

  useEffect(() => {
    const fetchAddons = async () => {
      if (!productId) return;

      setIsLoading(true);
      setError(null);

      try {
        const lists = await vm.getProductAddonLists(productId);
        setAddonLists(lists);
      } catch (err) {
        console.error("Erro ao buscar adicionais do produto:", err);
        setError(
          err instanceof Error ? err : new Error("Erro ao carregar adicionais")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddons();
  }, [productId, vm]);

  return {
    addonLists,
    isLoading,
    error,
    hasAddons: addonLists.length > 0,
  };
}
