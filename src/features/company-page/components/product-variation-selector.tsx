// Path: src/features/company-page/components/product-variation-selector.tsx
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Check, AlertCircle } from "lucide-react-native";
import { VStack } from "@gluestack-ui/themed";

interface VariationOption {
  id: string;
  name: string;
  price: string;
  promotional_price: string | null;
  description: string | null;
  image: string | null;
  available: boolean;
}

interface ProductVariationSelectorProps {
  options: VariationOption[];
  selectedOption: VariationOption | null;
  onSelect: (option: VariationOption) => void;
  isLoading: boolean;
  error: string | null;
  primaryColor: string;
}

export function ProductVariationSelector({
  options,
  selectedOption,
  onSelect,
  isLoading,
  error,
  primaryColor,
}: ProductVariationSelectorProps) {
  // Format currency
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Escolha a variação
        </Text>
        <View className="h-24 flex items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text className="text-gray-500 mt-2">Carregando opções...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Escolha a variação
        </Text>
        <View className="bg-red-50 border border-red-200 rounded-lg p-4 flex-row items-center">
          <AlertCircle size={20} color="#EF4444" />
          <Text className="text-red-600 ml-2">{error}</Text>
        </View>
      </View>
    );
  }

  if (options.length === 0) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Escolha a variação
        </Text>
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex-row items-center">
          <AlertCircle size={20} color="#F59E0B" />
          <Text className="text-yellow-600 ml-2">
            Nenhuma opção disponível para este produto
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Escolha a variação
      </Text>

      <VStack space="md">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option)}
              className={`flex-row items-center justify-between p-4 rounded-xl border ${
                isSelected ? "border-primary-500" : "border-gray-200"
              } ${isSelected ? "bg-gray-50" : "bg-white"}`}
              style={{
                borderColor: isSelected ? primaryColor : undefined,
              }}
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="font-medium text-gray-800 text-base mb-1">
                  {option.name}
                </Text>

                {/* Price display */}
                {option.promotional_price ? (
                  <View className="flex-row items-baseline">
                    <Text className="font-bold" style={{ color: primaryColor }}>
                      {formatCurrency(option.promotional_price)}
                    </Text>
                    <Text className="text-xs text-gray-400 line-through ml-2">
                      {formatCurrency(option.price)}
                    </Text>
                  </View>
                ) : (
                  <Text className="font-bold" style={{ color: primaryColor }}>
                    {formatCurrency(option.price)}
                  </Text>
                )}
              </View>

              {/* Selection indicator */}
              {isSelected ? (
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </TouchableOpacity>
          );
        })}
      </VStack>
    </View>
  );
}
