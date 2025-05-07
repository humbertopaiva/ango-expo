// Path: @/components/common/enhanced-select.tsx
// (Assumindo que você já tem este componente, vamos apenas atualizá-lo)

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface SelectOption {
  label: string;
  value: string;
  data?: any;
}

interface EnhancedSelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onSelect: () => void;
  placeholder?: string;
  isInvalid?: boolean;
  error?: string;
  helperText?: string;
}

export function EnhancedSelect({
  label,
  options,
  value,
  onSelect,
  placeholder = "Selecione uma opção",
  isInvalid = false,
  error,
  helperText,
}: EnhancedSelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View className="mb-1">
      <TouchableOpacity
        onPress={onSelect}
        className={`flex-row items-center justify-between border rounded-md p-3 ${
          isInvalid ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
        }`}
      >
        <Text
          className={`${
            selectedOption ? "text-gray-900" : "text-gray-500"
          } text-sm`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      {helperText && !isInvalid && (
        <Text className="text-xs text-gray-500 mt-1">{helperText}</Text>
      )}

      {isInvalid && error && (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
