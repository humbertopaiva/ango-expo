// Path: components/common/enhanced-select.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown } from "lucide-react-native";

export interface SelectOption {
  label: string;
  value: string | number;
  data?: any;
}

interface EnhancedSelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number | null;
  onSelect: () => void;
  placeholder?: string;
  isInvalid?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
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
  disabled = false,
}: EnhancedSelectProps) {
  const selectedOption = options.find(
    (option) =>
      option.value !== null &&
      option.value !== undefined &&
      option.value.toString() === (value !== null ? value.toString() : "")
  );

  return (
    <View className="mb-1">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      )}

      <TouchableOpacity
        onPress={onSelect}
        disabled={disabled}
        className={`flex-row items-center justify-between border rounded-md p-3 ${
          isInvalid
            ? "border-red-500 bg-red-50"
            : disabled
            ? "border-gray-200 bg-gray-100"
            : "border-gray-300 bg-white"
        }`}
      >
        <Text
          className={`${
            selectedOption
              ? disabled
                ? "text-gray-500"
                : "text-gray-900"
              : "text-gray-500"
          } text-sm`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={disabled ? "#9CA3AF" : "#6B7280"} />
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
