// Path: src/components/animations/animated-page-transition.tsx
import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";

interface AnimatedPageTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animation?: "fade" | "slide" | "scale" | "slideUp";
  duration?: number;
  delay?: number;
}

export function AnimatedPageTransition({
  children,
  style,
  animation = "fade",
  duration = 500,
  delay = 0,
}: AnimatedPageTransitionProps) {
  // Configuração das animações
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const translateX = useSharedValue(100);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Pequeno delay para garantir que a animação inicie após a montagem
    const timerId = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      translateY.value = withTiming(0, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      translateX.value = withTiming(0, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      scale.value = withTiming(1, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, delay);

    return () => clearTimeout(timerId);
  }, []);

  // Estilos animados
  const fadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const scaleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const slideUpAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Selecionar o estilo de animação
  const animatedStyle =
    animation === "fade"
      ? fadeAnimatedStyle
      : animation === "slide"
      ? slideAnimatedStyle
      : animation === "scale"
      ? scaleAnimatedStyle
      : slideUpAnimatedStyle;

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

// Variantes pré-definidas de animação para transição entre telas
export const PageTransitions = {
  FadeIn: FadeIn.duration(300).delay(50),
  FadeOut: FadeOut.duration(200),
  SlideIn: SlideInRight.duration(300),
  SlideOut: SlideOutLeft.duration(200),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
