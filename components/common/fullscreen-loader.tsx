// Path: components/common/fullscreen-loader.tsx

import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME_COLORS } from "@/src/styles/colors";

interface FullscreenLoaderProps {
  isVisible: boolean;
  backgroundColor?: string;
  logoSize?: number;
  showLogo?: boolean;
}

export function FullscreenLoader({
  isVisible,
  backgroundColor = THEME_COLORS.primary,
  logoSize = 120,
  showLogo = true,
}: FullscreenLoaderProps) {
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinnerAnim = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");

  // Configura as animações quando o componente monta ou o status de visibilidade muda
  useEffect(() => {
    if (isVisible) {
      // Reinicia animações quando se torna visível
      spinnerAnim.setValue(0);

      // Sequência de animações para entrada
      Animated.parallel([
        // Fade in da tela inteira
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),

        // Rotação contínua do spinner
        Animated.loop(
          Animated.timing(spinnerAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),

        // Fade in da logo
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
        }),

        // Animação de escala da logo
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animação de saída
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
    }
  }, [isVisible]);

  // Transformação de rotação para o spinner
  const spin = spinnerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, backgroundColor }]}
    >
      {/* Spinner centralizado */}
      <View style={styles.spinnerContainer}>
        <Animated.View
          style={[styles.spinner, { transform: [{ rotate: spin }] }]}
        >
          <View style={styles.spinnerInner} />
        </Animated.View>
      </View>

      {/* Logo na parte inferior */}
      {showLogo && (
        <Animated.View
          style={[
            styles.logoContainer,
            {
              paddingBottom: insets.bottom > 0 ? insets.bottom : 32,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={[styles.logo]}
            resizeMode="contain"
            className="w-28"
          />
        </Animated.View>
      )}
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
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderTopColor: "#FFFFFF",
    borderLeftColor: "rgba(255, 255, 255, 0.8)",
  },
  spinnerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: -4,
    left: "50%",
    marginLeft: -6,
  },
  logoContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: Platform.OS === "ios" ? 0 : 16,
  },
});
