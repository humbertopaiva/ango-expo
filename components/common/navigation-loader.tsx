// Path: src/components/common/navigation-loader.tsx
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigationLoading } from "@/src/providers/navigation-loading-provider";
import { THEME_COLORS } from "@/src/styles/colors";

export function NavigationLoader() {
  const { isNavigating } = useNavigationLoading();

  if (!isNavigating) return null;

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
      </View>
    </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
