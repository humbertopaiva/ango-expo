// Path: src/features/company-page/components/custom-product-step.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

import { CustomProductStepItem } from "./custom-product-step-item";
import { Card } from "@gluestack-ui/themed";
import { CustomProductItem } from "../models/custom-product";

interface CustomProductStepProps {
  step: any;
  expanded: boolean;
  onToggleExpand: () => void;
  isComplete: boolean;
  requiredSelections: number;
  currentSelections: number;
  isItemSelected: (itemId: string) => boolean;
  onSelectItem: (item: CustomProductItem) => void;
  primaryColor: string;
}

export function CustomProductStep({
  step,
  expanded,
  onToggleExpand,
  isComplete,
  requiredSelections,
  currentSelections,
  isItemSelected,
  onSelectItem,
  primaryColor,
}: CustomProductStepProps) {
  return (
    <Card className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
      {/* Header da etapa */}
      <TouchableOpacity
        onPress={onToggleExpand}
        className="flex-row justify-between items-center p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          {/* Número da etapa */}
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: primaryColor }}
          >
            <Text className="text-white font-bold">{step.passo_numero}</Text>
          </View>

          {/* Título e subtítulo */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              {step.nome || `Etapa ${step.passo_numero}`}
            </Text>
            <Text className="text-sm text-gray-600">
              Selecione {requiredSelections}{" "}
              {requiredSelections === 1 ? "item" : "itens"} ({currentSelections}
              /{requiredSelections})
            </Text>
          </View>
        </View>

        {/* Status de completude e botão de expandir */}
        <View className="flex-row items-center">
          {isComplete ? (
            <View className="mr-3 bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-green-700 text-xs font-medium">
                Completo
              </Text>
            </View>
          ) : (
            <View className="mr-3 bg-yellow-100 px-2 py-1 rounded-full">
              <Text className="text-yellow-700 text-xs font-medium">
                Pendente
              </Text>
            </View>
          )}

          {expanded ? (
            <ChevronUp size={24} color="#9CA3AF" />
          ) : (
            <ChevronDown size={24} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>

      {/* Conteúdo da etapa (produtos) */}
      {expanded && (
        <View className="p-4 bg-gray-50 border-t border-gray-200">
          {step.descricao ? (
            <Text className="text-gray-600 mb-4">{step.descricao}</Text>
          ) : null}

          {step.produtos.map((item: any) => (
            <CustomProductStepItem
              key={item.produtos.key}
              item={item}
              isSelected={isItemSelected(item.produtos.key)}
              primaryColor={primaryColor}
              onSelect={() => onSelectItem(item)}
            />
          ))}

          {step.produtos.length === 0 && (
            <Text className="text-gray-500 text-center py-4">
              Nenhum produto disponível nesta etapa.
            </Text>
          )}
        </View>
      )}
    </Card>
  );
}
