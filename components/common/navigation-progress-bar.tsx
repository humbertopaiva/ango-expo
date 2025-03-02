// Path: src/components/common/navigation-progress-bar.tsx (corrigido)
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigationLoading } from "@/src/providers/navigation-loading-provider";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export function NavigationProgressBar() {
  const { isNavigating } = useNavigationLoading();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isNavigating) {
      // Reset e mostra a barra
      progressAnim.setValue(0);

      // Anima a opacidade para mostrar a barra
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Anima o progresso para 70% rapidamente
      Animated.timing(progressAnim, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: false,
      }).start();

      // Depois anima lentamente até 90%
      setTimeout(() => {
        Animated.timing(progressAnim, {
          toValue: 0.9,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 500);
    } else {
      // Se não está navegando mais, completa a barra e esconde
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          delay: 200, // Pequeno delay para que o usuário veja a barra completa
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNavigating, progressAnim, opacityAnim]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  // Ajuste de posicionamento baseado na plataforma e área segura
  const topPosition = Platform.OS === "ios" ? insets.top : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          top: topPosition,
          width: width, // Garante que a largura ocupe toda a tela
          left: 0, // Garante que comece da extremidade esquerda
        },
      ]}
    >
      <Animated.View style={[styles.bar, { width: barWidth }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 3,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  bar: {
    height: "100%",
    backgroundColor: THEME_COLORS.primary,
  },
});
