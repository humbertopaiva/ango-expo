// Path: src/features/products/components/variation-selector.tsx
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { useCompanyVariations } from "../hooks/use-company-variations";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import { Tag } from "lucide-react-native";
import { CategorySelectModal } from "@/components/common/category-select-modal";
import { EnhancedSelect } from "@/components/common/enhanced-select";
import { useLocalSearchParams } from "expo-router";

interface VariationSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onVariationChange: (
    variationId: string,
    values: string[],
    name: string
  ) => void;
  error?: string;
  disabled?: boolean;
  productId?: string; // ID do produto atual para edição
}

export function VariationSelector({
  value,
  onChange,
  onVariationChange,
  error,
  disabled = false,
  productId,
}: VariationSelectorProps) {
  const { variations = [], isLoading } = useCompanyVariations();
  const { variationItems } = useProductVariationItems(); // Carregar todos os itens
  const [isModalVisible, setIsModalVisible] = useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const currentProductId = productId || params.id;

  // Processamento das variações para remoção daquelas já usadas
  const availableVariations = React.useMemo(() => {
    if (!Array.isArray(variations)) return [];

    // Se estiver editando um produto, permitir manter a variação atual
    if (currentProductId && value) {
      return variations.filter((v) => {
        const isCurrentVariation = v.id === value;
        if (isCurrentVariation) return true;

        // Verificar se esta variação já está sendo usada por outro produto
        const isUsedByOtherProduct = variationItems.some(
          (item) =>
            item.produto.id !== currentProductId && item.variacao.id === v.id
        );

        return !isUsedByOtherProduct;
      });
    }

    // Caso de criação de produto, filtrar variações já usadas
    return variations.filter((v) => {
      const isUsedByAnyProduct = variationItems.some(
        (item) => item.variacao.id === v.id
      );

      return !isUsedByAnyProduct;
    });
  }, [variations, variationItems, value, currentProductId]);

  // Formatar variações para o formato esperado pelo seletor
  const variationOptions = React.useMemo(() => {
    return availableVariations.map((variation) => ({
      label: variation.nome,
      value: variation.id,
      data: variation.variacao,
    }));
  }, [availableVariations]);

  // Quando uma variação é selecionada, retornar os valores disponíveis
  useEffect(() => {
    if (value) {
      const selectedVariation = availableVariations.find((v) => v.id === value);
      if (selectedVariation) {
        onVariationChange(
          value,
          selectedVariation.variacao,
          selectedVariation.nome
        );
      }
    }
  }, [value, availableVariations, onVariationChange]);

  // Valor processado para garantir que é sempre uma string
  const safeValue = value || "";

  return (
    <FormControl isInvalid={!!error} isDisabled={disabled || isLoading}>
      <FormControlLabel>
        <Text className="text-sm font-medium text-gray-700">
          Tipo de Variação <Text className="text-red-500">*</Text>
        </Text>
      </FormControlLabel>

      <Text className="text-xs text-gray-500 -mt-1 mb-2">
        Selecione o tipo de variação para este produto (ex: Tamanho, Cor). Cada
        produto só pode ter um tipo de variação.
      </Text>

      {variationOptions.length > 0 ? (
        <>
          <EnhancedSelect
            label="Selecionar tipo de variação"
            options={variationOptions}
            value={safeValue}
            onSelect={() => setIsModalVisible(true)}
            placeholder="Selecione o tipo de variação"
            isInvalid={!!error}
            error={error}
            helperText="Após selecionar, você poderá adicionar valores específicos para cada opção"
          />

          <CategorySelectModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            options={variationOptions}
            selectedValue={safeValue}
            onSelect={(selectedValue) => {
              onChange(selectedValue !== null ? String(selectedValue) : null);
              setIsModalVisible(false);
            }}
            title="Selecionar Tipo de Variação"
          />
        </>
      ) : (
        <View className="p-4 border border-gray-300 rounded-md bg-gray-50">
          <Text className="text-gray-600 font-medium mb-1">
            {isLoading
              ? "Carregando variações..."
              : availableVariations.length === 0 && variations.length > 0
              ? "Todas as variações já estão em uso"
              : "Nenhuma variação disponível"}
          </Text>
          <Text className="text-xs text-gray-500">
            {availableVariations.length === 0 && variations.length > 0
              ? "Cada tipo de variação só pode ser usado em um produto. Crie uma nova variação antes de continuar."
              : "Você precisa cadastrar tipos de variação antes de usar essa funcionalidade. Acesse o menu 'Variações' para criar."}
          </Text>
        </View>
      )}

      {error && (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
