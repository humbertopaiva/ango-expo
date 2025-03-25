// Path: components/common/simple-fullscreen-loader.tsx

import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface SimpleFullscreenLoaderProps {
  isVisible: boolean;
  backgroundColor?: string;
  logoSize?: number;
}

export function SimpleFullscreenLoader({
  isVisible,
  backgroundColor = THEME_COLORS.primary,
  logoSize = 120,
}: SimpleFullscreenLoaderProps) {
  // Animação para o fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Configura animações quando a visibilidade muda
  useEffect(() => {
    if (isVisible) {
      // Aparecer
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      // Desaparecer
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
    }
  }, [isVisible]);

  // Se não estiver visível, não renderiza
  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require("@/assets/images/logo-white.png")}
          style={[styles.logo, { width: logoSize * 2, height: logoSize }]}
          resizeMode="contain"
        />

        {/* Spinner abaixo da logo */}
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.spinner}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 30,
  },
  spinner: {
    transform: [{ scale: 1.2 }], // Um pouco maior
  },
});
