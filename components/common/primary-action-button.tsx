// Path: components/common/primary-action-button.tsx

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { FloatingActionButton } from "./floating-action-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PrimaryActionButtonProps {
  onPress: () => void;
  label?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  floating?: boolean;
  position?: "bottom" | "top";
  primaryColor?: string;
  secondaryColor?: string;
  disabled?: boolean; // Nova propriedade
}

export function PrimaryActionButton({
  onPress,
  label,
  icon,
  style,
  floating = false,
  position = "bottom",
  primaryColor,
  secondaryColor,
  disabled = false, // Valor padrão é false
}: PrimaryActionButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        position === "bottom" && { bottom: 0 },
        position === "top" && { top: 0 },
        style,
      ]}
    >
      <FloatingActionButton
        onPress={onPress}
        label={label}
        icon={icon}
        fullWidth={!floating}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
