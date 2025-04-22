// Path: src/features/products/hooks/use-variation-values.ts
import { useState, useEffect } from "react";
import { useCompanyVariations } from "./use-company-variations";

export function useVariationValues(variationId: string | null | undefined) {
  const { variations, isLoading } = useCompanyVariations();
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (!variationId) {
      setValues([]);
      return;
    }

    const selectedVariation = variations.find((v) => v.id === variationId);
    if (selectedVariation && Array.isArray(selectedVariation.variacao)) {
      setValues(selectedVariation.variacao);
    } else {
      setValues([]);
    }
  }, [variationId, variations]);

  return {
    values,
    isLoading,
  };
}
