// Path: src/utils/animations.utils.ts
import { Animated, Easing } from "react-native";

/**
 * Utilitários para animações comuns na aplicação
 */
export const animationUtils = {
  /**
   * Cria uma animação de destaque (pulse) em um elemento
   * @param value Valor Animated a ser animado
   * @param duration Duração da animação em ms
   * @returns Função para iniciar a animação
   */
  createPulseAnimation: (
    value: Animated.Value,
    duration: number = 300
  ): (() => void) => {
    return () => {
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0.95,
          duration: duration / 3,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1.05,
          duration: duration / 3,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(value, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    };
  },

  /**
   * Cria uma animação de fadeIn em um elemento
   * @param value Valor Animated a ser animado
   * @param duration Duração da animação em ms
   * @param delay Atraso antes de iniciar a animação
   * @returns Função para iniciar a animação
   */
  createFadeInAnimation: (
    value: Animated.Value,
    duration: number = 400,
    delay: number = 0
  ): (() => void) => {
    return () => {
      value.setValue(0);
      Animated.timing(value, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    };
  },

  /**
   * Cria uma animação de slideIn em um elemento
   * @param value Valor Animated a ser animado
   * @param startPosition Posição inicial (ex: 100 para slideIn da direita)
   * @param duration Duração da animação em ms
   * @param delay Atraso antes de iniciar a animação
   * @returns Função para iniciar a animação
   */
  createSlideInAnimation: (
    value: Animated.Value,
    startPosition: number,
    duration: number = 400,
    delay: number = 0
  ): (() => void) => {
    return () => {
      value.setValue(startPosition);
      Animated.timing(value, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    };
  },

  /**
   * Cria uma animação de escala para um elemento
   * @param value Valor Animated a ser animado
   * @param startScale Escala inicial (ex: 0.8)
   * @param endScale Escala final (ex: 1)
   * @param duration Duração da animação em ms
   * @returns Função para iniciar a animação
   */
  createScaleAnimation: (
    value: Animated.Value,
    startScale: number = 0.9,
    endScale: number = 1,
    duration: number = 300
  ): (() => void) => {
    return () => {
      value.setValue(startScale);
      Animated.spring(value, {
        toValue: endScale,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };
  },
};
