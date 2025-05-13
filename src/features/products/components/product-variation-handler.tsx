// Path: src/features/products/components/product-variation-handler.tsx
import React, { useState, useCallback, memo } from "react";
import { View, Text } from "react-native";
import { FormControl } from "@gluestack-ui/themed";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { StatusToggle } from "@/components/common/status-toggle";
import { VariationSelector } from "./variation-selector";
import { Layers } from "lucide-react-native";
import { ProductFormData } from "../schemas/product.schema";

interface ProductVariationHandlerProps {
  control: Control<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  errors: any;
  isSubmitting: boolean;
  onVariationWarning: () => void;
  productId?: string;
}

// Usando memo para evitar re-renderizações desnecessárias
export const ProductVariationHandler = memo(
  ({
    control,
    watch,
    setValue,
    errors,
    isSubmitting,
    onVariationWarning,
    productId,
  }: ProductVariationHandlerProps) => {
    // Estados locais para armazenar informações sobre a variação
    const [selectedVariationName, setSelectedVariationName] =
      useState<string>("");
    const [variationValues, setVariationValues] = useState<string[]>([]);

    // Valores observados
    const isVariacaoEnabled = watch("is_variacao_enabled");
    const variationValue = watch("variacao");

    // Handler para mudança no campo is_variacao_enabled
    const handleVariacaoEnabledChange = useCallback(
      (value: boolean) => {
        // Se estiver marcando como produto com variação
        if (value && !isVariacaoEnabled) {
          onVariationWarning();
        } else {
          setValue("is_variacao_enabled", value);

          // Se estiver desmarcando, limpe os campos de variação
          if (!value) {
            setValue("variacao", null);
            setVariationValues([]);
            setSelectedVariationName("");
          }
        }
      },
      [isVariacaoEnabled, onVariationWarning, setValue]
    );

    // Função para lidar com a mudança na seleção de variação
    const handleVariationChange = useCallback(
      (variationId: string, values: string[], name: string) => {
        setVariationValues(values);
        setSelectedVariationName(name);
      },
      []
    );

    return (
      <View>
        <FormControl>
          <Text className="text-sm font-medium text-gray-700">
            Tipo de Produto
          </Text>
          <StatusToggle
            value={isVariacaoEnabled}
            onChange={handleVariacaoEnabledChange}
            activeLabel="Produto com variações (tamanhos, cores, etc.)"
            inactiveLabel="Produto simples (sem variações)"
            disabled={isSubmitting}
          />
        </FormControl>

        {isVariacaoEnabled && (
          <View className="mt-4">
            <VariationSelector
              value={variationValue ?? null}
              onChange={(value) => setValue("variacao", value)}
              onVariationChange={handleVariationChange}
              error={errors.variacao?.message}
              disabled={isSubmitting}
              productId={productId}
            />

            {variationValue && variationValues.length > 0 && (
              <View className="mt-2 p-3 bg-blue-50 rounded-md">
                <View className="flex-row gap-2">
                  <Layers size={16} color="#1E40AF" className="mt-1 mr-2" />
                  <Text className="text-blue-800 text-sm flex-1">
                    Variação selecionada: {selectedVariationName}. As opções
                    disponíveis são: {variationValues.join(", ")}. Você poderá
                    criar variações específicas após salvar este produto.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
);

// Prevenindo re-renderizações desnecessárias
ProductVariationHandler.displayName = "ProductVariationHandler";
