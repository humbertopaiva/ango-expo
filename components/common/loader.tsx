// Path: src/components/common/loader.tsx
import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useLoading } from "@/src/providers/loading-provider";
import { THEME_COLORS } from "@/src/styles/colors";

const { width, height } = Dimensions.get("window");

export function Loader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
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
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 9999,
  },
  loaderContainer: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
