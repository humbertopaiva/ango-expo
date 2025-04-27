// Path: src/features/company-page/components/variation-indicator.tsx

import React from "react";
import { View, Text } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface VariationIndicatorProps {
  variationName: string;
  optionsCount: number;
  primaryColor?: string;
}

export function VariationIndicator({
  variationName,
  optionsCount,
  primaryColor = "#F4511E",
}: VariationIndicatorProps) {
  return (
    <View className="flex-row items-center justify-between bg-gray-50 rounded-lg p-2 mt-1">
      <View>
        <Text className="text-sm font-medium text-gray-700">
          {variationName}
        </Text>
        <Text className="text-xs text-gray-500">
          {optionsCount} {optionsCount === 1 ? "opção" : "opções"} disponíveis
        </Text>
      </View>
      <View
        className="w-6 h-6 rounded-full items-center justify-center"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <ChevronRight size={14} color={primaryColor} />
      </View>
    </View>
  );
}
