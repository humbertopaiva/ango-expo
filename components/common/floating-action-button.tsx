// components/ui/floating-action-button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingActionButtonProps {
  onPress: () => void;
  label?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  fullWidth?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export function FloatingActionButton({
  onPress,
  label,
  icon,
  style,
  labelStyle,
  fullWidth = false,
  primaryColor = "#F4511E",
  secondaryColor = "#6200EE",
}: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        fullWidth ? styles.fullWidth : styles.floating,
        { paddingBottom: bottomPadding },
        style,
      ]}
    >
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          fullWidth ? styles.fullWidthGradient : styles.floatingGradient,
        ]}
      >
        {icon || <Plus size={24} color="white" />}
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  floating: {
    right: 16,
    bottom: 16,
  },
  fullWidth: {
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  floatingGradient: {
    borderRadius: 28,
    width: 56,
    height: 56,
  },
  fullWidthGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
  },
  label: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
