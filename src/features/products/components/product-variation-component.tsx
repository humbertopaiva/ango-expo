// Path: src/features/products/components/product-variation-component.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text } from "react-native";
import {
  FormControl,
  FormControlLabel,
  Switch,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { VariationSelector } from "./variation-selector";
import { useForm, Controller } from "react-hook-form";

interface ProductVariationComponentProps {
  control: any; // React Hook Form control
  watch: any; // React Hook Form watch
  setValue: any; // React Hook Form setValue
  errors: any; // React Hook Form errors
}

export function ProductVariationComponent({
  control,
  watch,
  setValue,
  errors,
}: ProductVariationComponentProps) {
  // Observa se a variação está habilitada
  const isVariationEnabled = watch("is_variacao_enabled");
  // Armazena os valores da variação localmente para evitar ciclos de renderização
  const [variationValues, setVariationValues] = useState<string[]>([]);
  const [variationName, setVariationName] = useState<string>("");

  // Usando useCallback para garantir que esta função não cause re-renders desnecessários
  const handleVariationChange = useCallback(
    (variationId: string, values: string[], name: string) => {
      // Armazena os valores apenas no estado local sem causar re-renders
      setVariationValues(values);
      setVariationName(name);
    },
    []
  );

  return (
    <View className="space-y-4">
      {/* Switch para habilitar/desabilitar variação */}
      <FormControl>
        <View className="flex-row items-center justify-between">
          <FormControlLabel>
            <Text className="text-sm font-medium text-gray-700">
              Habilitar Variações
            </Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="is_variacao_enabled"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onToggle={(newValue) => {
                  onChange(newValue);
                  // Se desabilitar variações, limpa o valor da variação
                  if (!newValue) {
                    setValue("variacao", null);
                  }
                }}
                trackColor={{ false: "#E5E7EB", true: "#F4511E" }}
              />
            )}
          />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          Ative para criar múltiplas opções de um mesmo produto (ex: tamanho,
          cor)
        </Text>
      </FormControl>

      {/* Seletor de variação, exibido apenas se variação estiver habilitada */}
      {isVariationEnabled && (
        <Controller
          control={control}
          name="variacao"
          render={({ field: { onChange, value } }) => (
            <VariationSelector
              value={value}
              onChange={onChange}
              onVariationChange={handleVariationChange}
              error={errors.variacao?.message}
            />
          )}
        />
      )}

      {/* Informações da variação selecionada */}
      {isVariationEnabled && variationValues.length > 0 && (
        <View className="bg-blue-50 p-4 rounded-lg mt-2">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            Valores disponíveis para {variationName}:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {variationValues.map((value, index) => (
              <View
                key={`${value}-${index}`}
                className="bg-blue-100 px-3 py-1 rounded-full"
              >
                <Text className="text-xs text-blue-700">{value}</Text>
              </View>
            ))}
          </View>
          <Text className="text-xs text-blue-600 mt-2">
            Depois de salvar, você poderá configurar preços específicos para
            cada opção de {variationName.toLowerCase()}.
          </Text>
        </View>
      )}
    </View>
  );
}
