// Path: src/features/shop-window/hooks/use-product-variation.ts
import { useState, useEffect } from "react";
import { useProductVariationItems } from "../../products/hooks/use-product-variations-items";

export function useProductVariation(productId?: string | null) {
  const [hasVariation, setHasVariation] = useState(false);
  const { variationItems, isLoading, refetch } = useProductVariationItems(
    productId || undefined
  );

  useEffect(() => {
    // If we have variation items, then the product has variations
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
