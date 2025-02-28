// Path: components/custom/swipe-tutorial.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { ChevronsLeft } from "lucide-react-native";
import { Alert } from "@/components/ui/alert";

interface SwipeTutorialProps {
  show: boolean;
  onDismiss: () => void;
}

export function SwipeTutorial({ show, onDismiss }: SwipeTutorialProps) {
  const slideAnimation = useRef(new Animated.Value(-30)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      // Aparece com fade in
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Animação de deslize
      const startSlideAnimation = () => {
        Animated.sequence([
          // Move para a direita
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Move para a esquerda (mostrando as ações)
          Animated.timing(slideAnimation, {
            toValue: -80,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Volta para o centro
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Repete a animação após uma pausa
          setTimeout(startSlideAnimation, 2000);
        });
      };

      startSlideAnimation();

      // Auto-dismiss após 10 segundos
      const timer = setTimeout(() => {
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [show, slideAnimation, opacityAnimation, onDismiss]);

  if (!show) return null;

  return (
    <Animated.View
      style={{
        opacity: opacityAnimation,
      }}
      className="mb-4"
    >
      <Alert className="bg-blue-50 border border-blue-200">
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-blue-800 font-medium mb-1">
              Dica: Deslize para ações rápidas
            </Text>
            <Text className="text-blue-600 text-sm">
              Deslize os itens para a esquerda para acessar opções de edição e
              exclusão.
            </Text>
          </View>
          <Animated.View
            style={{
              transform: [{ translateX: slideAnimation }],
            }}
          >
            <ChevronsLeft size={24} color="#1E40AF" />
          </Animated.View>
        </View>
      </Alert>
    </Animated.View>
  );
}
