// Path: src/components/common/global-loader.tsx (corrigido)
import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { useQueryLoading } from "@/src/providers/query-loading-provider";
import { THEME_COLORS } from "@/src/styles/colors";

interface GlobalLoaderProps {
  color?: string;
  size?: "small" | "large";
  opacity?: number;
}

export function GlobalLoader({
  color = THEME_COLORS.primary,
  size = "large",
  opacity = 0.4,
}: GlobalLoaderProps) {
  const { isLoading } = useQueryLoading();

  if (!isLoading) return null;

  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View
        style={[
          styles.container,
          { backgroundColor: `rgba(0, 0, 0, ${opacity})` },
        ]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loaderContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
