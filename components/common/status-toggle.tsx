// Path: src/components/common/status-toggle.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Check, X } from "lucide-react-native";

interface StatusToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
  primaryColor?: string;
}

export function StatusToggle({
  value,
  onChange,
  activeLabel = "Disponível",
  inactiveLabel = "Indisponível",
  disabled = false,
  primaryColor = "#F4511E",
}: StatusToggleProps) {
  // Função para alternar o estado
  const toggleStatus = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleStatus}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        styles.container,
        {
          backgroundColor: value
            ? `${primaryColor}15` // 15% de opacidade para o background
            : "#F3F4F6",
          borderColor: value ? primaryColor : "#D1D5DB",
        },
        disabled && styles.disabled,
      ]}
    >
      {/* Ícone do status */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: value ? primaryColor : "#9CA3AF",
          },
        ]}
      >
        {value ? (
          <Check size={16} color="white" />
        ) : (
          <X size={16} color="white" />
        )}
      </View>

      {/* Texto do status */}
      <Text
        style={[
          styles.label,
          {
            color: value ? primaryColor : "#4B5563",
            fontWeight: value ? "600" : "400",
          },
        ]}
      >
        {value ? activeLabel : inactiveLabel}
      </Text>

      {/* Indicador visual de que é interativo */}
      <View style={styles.toggleHint}>
        <View
          style={[
            styles.toggleDot,
            { backgroundColor: value ? primaryColor : "#9CA3AF" },
            value && styles.activeDot,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.6,
  },
  toggleHint: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    padding: 2,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#9CA3AF",
  },
  activeDot: {
    transform: [{ translateX: 16 }],
  },
});
