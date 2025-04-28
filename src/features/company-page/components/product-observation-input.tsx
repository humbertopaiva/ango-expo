// Path: src/features/company-page/components/product-observation-input.tsx

import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MessageSquare } from "lucide-react-native";

interface ProductObservationInputProps {
  observation: string;
  showInput: boolean;
  onToggleInput: () => void;
  onChangeText: (text: string) => void;
  primaryColor: string;
}

export function ProductObservationInput({
  observation,
  showInput,
  onToggleInput,
  onChangeText,
  primaryColor,
}: ProductObservationInputProps) {
  return (
    <View className="mb-6">
      <TouchableOpacity
        onPress={onToggleInput}
        className="flex-row items-center mb-2"
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <MessageSquare size={18} color={primaryColor} />
        </View>
        <Text className="font-medium text-base" style={{ color: primaryColor }}>
          {showInput ? "Ocultar observação" : "Adicionar observação"}
        </Text>
      </TouchableOpacity>

      {showInput && (
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <TextInput
            value={observation}
            onChangeText={onChangeText}
            placeholder="Alguma observação? Ex: Sem cebola, bem passado..."
            multiline
            numberOfLines={3}
            className="text-gray-700 min-h-24"
            style={{ textAlignVertical: "top" }}
          />
          <Text className="text-gray-500 text-xs mt-2">
            Informe aqui preferências ou instruções especiais para este produto.
          </Text>
        </View>
      )}
    </View>
  );
}
