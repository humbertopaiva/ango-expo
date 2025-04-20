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
import { Tag } from "lucide-react-native";
import { CategorySelectModal } from "@/components/common/category-select-modal";
import { EnhancedSelect } from "@/components/common/enhanced-select";

interface VariationSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onVariationChange: (variationId: string, values: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function VariationSelector({
  value,
  onChange,
  onVariationChange,
  error,
  disabled = false,
}: VariationSelectorProps) {
  const { variations = [], isLoading } = useCompanyVariations();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Processamento defensivo das variações
  const processedVariations = React.useMemo(() => {
    if (!Array.isArray(variations)) return [];

    return variations.map((v) => ({
      ...v,
      id: v?.id || "",
      nome: v?.nome || "Sem nome",
      variacao: Array.isArray(v?.variacao) ? v.variacao : [],
    }));
  }, [variations]);

  // Formatar variações para o formato esperado pelo seletor
  const variationOptions = React.useMemo(() => {
    return processedVariations.map((variation) => ({
      label: variation.nome,
      value: variation.id,
      data: variation.variacao,
    }));
  }, [processedVariations]);

  // Quando uma variação é selecionada, retornar os valores disponíveis
  useEffect(() => {
    if (value) {
      const selectedVariation = processedVariations.find((v) => v.id === value);
      if (selectedVariation) {
        onVariationChange(value, selectedVariation.variacao);
      }
    }
  }, [value, processedVariations, onVariationChange]);

  // Valor processado para garantir que é sempre uma string
  const safeValue = value || "";

  return (
    <FormControl isInvalid={!!error} isDisabled={disabled || isLoading}>
      <FormControlLabel>
        <Text className="text-sm font-medium text-gray-700">
          Tipo de Variação
        </Text>
      </FormControlLabel>

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
          />

          <CategorySelectModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            options={variationOptions}
            selectedValue={safeValue}
            onSelect={(selectedValue) => {
              onChange(selectedValue);
              setIsModalVisible(false);
            }}
            title="Selecionar Tipo de Variação"
          />
        </>
      ) : (
        <View className="p-3 border border-gray-300 rounded-md bg-gray-50">
          <Text className="text-gray-500">
            {isLoading
              ? "Carregando variações..."
              : "Nenhuma variação disponível. Cadastre variações primeiro."}
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
