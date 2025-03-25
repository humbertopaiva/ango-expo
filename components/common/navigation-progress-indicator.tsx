// Path: components/common/navigation-progress-indicator.tsx

import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoading } from "@/src/providers/smart-loading-provider";

const { width } = Dimensions.get("window");

/**
 * Componente que mostra um indicador de progresso sutil para navegações
 * Uma barra fina que aparece no topo da tela e avança enquanto carrega
 */
export function NavigationProgressIndicator() {
  const { isQueryLoading, isNavigating } = useLoading();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // Exibe o indicador apenas quando estiver navegando E carregando dados
  const isActive = isQueryLoading && isNavigating;

  useEffect(() => {
    if (isActive) {
      // Reset animações
      progressAnim.setValue(0);
      opacityAnim.setValue(0);

      // Sequência de animações
      Animated.sequence([
        // Aparece suavemente
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),

        // Primeiro vai até 30% rapidamente
        Animated.timing(progressAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: false,
        }),

        // Depois continua mais lentamente até 80%
        Animated.timing(progressAnim, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (progressAnim) {
      // Se estava carregando e parou, completa até 100%
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          delay: 200, // Aguarda um pouco para desaparecer
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset para o próximo uso
        progressAnim.setValue(0);
      });
    }
  }, [isActive]);

  // Calcular a largura da barra com base no progresso
  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          top: insets.top,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.bar,
          {
            width: barWidth,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  bar: {
    height: "100%",
    backgroundColor: THEME_COLORS.primary,
  },
});
