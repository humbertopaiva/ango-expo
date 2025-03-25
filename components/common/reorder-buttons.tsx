// Path: src/components/common/reorder-buttons.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronUp, ChevronDown } from "lucide-react-native";

interface ReorderButtonsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function ReorderButtons({ onMoveUp, onMoveDown }: ReorderButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.upButton,
          !onMoveUp && styles.disabledButton,
        ]}
        onPress={onMoveUp}
        disabled={!onMoveUp}
        activeOpacity={onMoveUp ? 0.7 : 1}
      >
        <ChevronUp size={24} color={onMoveUp ? "#F4511E" : "#CBD5E1"} />
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[
          styles.button,
          styles.downButton,
          !onMoveDown && styles.disabledButton,
        ]}
        onPress={onMoveDown}
        disabled={!onMoveDown}
        activeOpacity={onMoveDown ? 0.7 : 1}
      >
        <ChevronDown size={24} color={onMoveDown ? "#F4511E" : "#CBD5E1"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 90,
    borderRadius: 12,
    backgroundColor: "white",
    borderColor: "#F1F5F9",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  button: {
    width: 48,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  upButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  downButton: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "#F8FAFC",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#F1F5F9",
  },
});
