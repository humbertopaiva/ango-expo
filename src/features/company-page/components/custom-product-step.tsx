// Path: src/features/company-page/components/custom-product-step.tsx
import React from "react";
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
  minimumSelections: number;
  maxSelections: number;
  currentSelections: number;
  isItemSelected: (itemId: string) => boolean;
  onSelectItem: (item: CustomProductItem) => void;
  primaryColor: string;
  showPrices: boolean; // Nova propriedade para controlar exibição de preços
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
  // Determina se a etapa é opcional
  const isOptionalStep = minimumSelections === 0;

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
              {isOptionalStep
                ? "Escolha opcional"
                : `Selecione pelo menos ${minimumSelections} ${
                    minimumSelections === 1 ? "item" : "itens"
                  }`}
              {maxSelections > 0 ? ` (máximo ${maxSelections})` : ""}
              {` • ${currentSelections} ${
                currentSelections === 1 ? "selecionado" : "selecionados"
              }`}
            </Text>
          </View>
        </View>

        {/* Status de completude e botão de expandir */}
        <View className="flex-row items-center">
          {isOptionalStep ? (
            <View className="mr-3 bg-gray-100 px-2 py-1 rounded-full">
              <Text className="text-gray-600 text-xs font-medium">
                Opcional
              </Text>
            </View>
          ) : isComplete ? (
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

          {/* Aviso sobre preços, quando aplicável */}
          {showPrices && (
            <View className="mb-4 bg-blue-50 p-3 rounded-lg">
              <Text className="text-blue-700 text-sm">
                Os preços abaixo serão somados ao valor total do produto
                personalizado.
              </Text>
            </View>
          )}

          {step.produtos.map((item: any) => (
            <CustomProductStepItem
              key={item.produtos.key}
              item={item}
              isSelected={isItemSelected(item.produtos.key)}
              primaryColor={primaryColor}
              onSelect={() => onSelectItem(item)}
              showPrice={showPrices}
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
