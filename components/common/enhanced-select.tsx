// Path: src/components/common/enhanced-select.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface EnhancedSelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number | null;
  onSelect: () => void;
  placeholder?: string;
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  required?: boolean;
}

export function EnhancedSelect({
  label,
  options,
  value,
  onSelect,
  placeholder = "Selecione uma opção",
  error,
  isInvalid,
  isDisabled,
  className = "",
  required = false,
}: EnhancedSelectProps) {
  // Encontrar a opção selecionada para exibição
  const selectedOption = options.find(
    (option) =>
      option.value !== null &&
      option.value !== undefined &&
      option.value.toString() === (value !== null ? value.toString() : "")
  );

  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={styles.container} className={className}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.selectContainer,
          isInvalid && styles.invalidContainer,
          isDisabled && styles.disabledContainer,
        ]}
        onPress={isDisabled ? undefined : onSelect}
        activeOpacity={isDisabled ? 1 : 0.7}
      >
        <Text
          style={[
            styles.selectText,
            !selectedOption && styles.placeholderText,
            isDisabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>

        <ChevronDown
          size={20}
          color={isDisabled ? "#9CA3AF" : THEME_COLORS.primary}
        />
      </TouchableOpacity>

      {isInvalid && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  invalidContainer: {
    borderColor: "#EF4444",
  },
  disabledContainer: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
    opacity: 0.8,
  },
  selectText: {
    fontSize: 15,
    color: "#111827",
    flex: 1,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  disabledText: {
    color: "#6B7280",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});
