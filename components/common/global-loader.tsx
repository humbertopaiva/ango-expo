// Path: src/components/common/global-loader.tsx
import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { useQueryLoading } from "@/src/providers/query-loading-provider";

interface GlobalLoaderProps {
  color?: string;
  size?: "small" | "large";
  opacity?: number;
}

export function GlobalLoader({
  color = "#F4511E",
  size = "large",
  opacity = 0.4,
}: GlobalLoaderProps) {
  const { isLoading } = useQueryLoading();

  if (!isLoading) return null;

  // Para web, podemos usar uma abordagem menos intrusiva
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.container,
          { opacity, backgroundColor: `rgba(0, 0, 0, ${opacity})` },
        ]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    );
  }

  // Para mobile, usamos um Modal para garantir que fica por cima de tudo
  return (
    <Modal transparent={true} visible={isLoading} animationType="fade">
      <View
        style={[
          styles.container,
          { opacity, backgroundColor: `rgba(0, 0, 0, ${opacity})` },
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
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loaderContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
