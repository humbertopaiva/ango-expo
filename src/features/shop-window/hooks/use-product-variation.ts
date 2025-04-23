// Path: src/features/products/hooks/use-product-variation.ts
import { useState, useEffect } from "react";
import { useProductVariationItems } from "../../products/hooks/use-product-variations-items";

export function useProductVariation(productId?: string | null) {
  const [hasVariation, setHasVariation] = useState(false);
  const { variationItems, isLoading, refetch } = useProductVariationItems(
    productId || undefined
  );

  useEffect(() => {
    // Se temos itens de variação, então o produto tem variações
    if (!isLoading && variationItems.length > 0) {
      setHasVariation(true);
    } else if (!isLoading) {
      setHasVariation(false);
    }
  }, [isLoading, variationItems]);

  return {
    hasVariation,
    variationItems,
    isLoading,
    refetch,
  };
}
