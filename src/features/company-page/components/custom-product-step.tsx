// Path: src/features/company-page/components/custom-product-step.tsx

import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Check, AlertTriangle } from "lucide-react-native";
import {
  CustomProductStep as CustomProductStepType,
  CustomProductItem,
} from "../models/custom-product";
import { CustomProductItemCard } from "./custom-product-item-card";

interface CustomProductStepProps {
  step: CustomProductStepType;
  expanded: boolean;
  onToggleExpand: () => void;
  isComplete: boolean;
  minimumSelections: number;
  maxSelections: number;
  currentSelections: number;
  isItemSelected: (itemId: string) => boolean;
  onSelectItem: (item: CustomProductItem) => void;
  primaryColor: string;
  showPrices: boolean;
}

export function CustomProductStep({
  step,
  expanded,
  onToggleExpand,
  isComplete,
  minimumSelections,
  maxSelections,
  currentSelections,
  isItemSelected,
  onSelectItem,
  primaryColor,
  showPrices,
}: CustomProductStepProps) {
  // Renderizar o contador de seleções
  const renderSelectionCounter = () => {
    // Se não houver limite máximo, não mostrar contador
    if (maxSelections === 0) return null;

    return (
      <View className="flex-row items-center">
        <Text
          className={`text-sm font-medium ${
            isComplete
              ? "text-green-600"
              : minimumSelections > 0
              ? "text-amber-600"
              : "text-gray-500"
          }`}
        >
          {currentSelections}/{maxSelections > 0 ? maxSelections : "∞"}
        </Text>

        {isComplete ? (
          <Check size={16} color="#16A34A" className="ml-1" />
        ) : minimumSelections > 0 && currentSelections < minimumSelections ? (
          <AlertTriangle size={16} color="#F59E0B" className="ml-1" />
        ) : null}
      </View>
    );
  };

  return (
    <View className="mb-4 bg-white overflow-hidden">
      {/* Step header - simplified */}
      <View
        className="p-3 flex-row justify-between items-center mx-2 rounded-md "
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        <View className="flex-1">
          <Text className="font-medium text-gray-800">
            {step.nome || `Passo ${step.passo_numero}`}
          </Text>
          {step.descricao && (
            <Text className="text-xs text-gray-500 mt-0.5">
              {step.descricao}
            </Text>
          )}
        </View>

        {/* Selection counter */}
        {renderSelectionCounter()}
      </View>

      {/* Step content - always visible */}
      <View className="p-2">
        {minimumSelections > 0 && (
          <Text className="text-xs text-amber-700 mb-2 px-1">
            {minimumSelections === 1
              ? "Selecione pelo menos 1 item"
              : `Selecione pelo menos ${minimumSelections} itens`}
          </Text>
        )}

        <FlatList
          data={step.produtos}
          keyExtractor={(item) => item.produtos.key}
          numColumns={1}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <CustomProductItemCard
              item={item}
              isSelected={isItemSelected(item.produtos.key)}
              onSelect={() => onSelectItem(item)}
              primaryColor={primaryColor}
              showPrice={showPrices}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-1" />}
        />
      </View>
    </View>
  );
}
