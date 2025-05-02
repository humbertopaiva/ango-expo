// Path: components/ui/screen-header.tsx
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { HStack } from "./hstack";
import { VStack } from "./vstack";
import { THEME_COLORS } from "@/src/styles/colors";
import { useNavigation } from "@/src/providers/navigation-provider";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string; // Usado como rota específica para navegação
  variant?: "primary" | "white";
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}

export default function ScreenHeader({
  title,
  subtitle,
  showBackButton = true,
  backTo,
  variant = "primary",
  onBackPress,
  rightContent,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  // Usando o hook de navegação personalizado
  const { navigateBack } = useNavigation();

  const bgColor = variant === "primary" ? THEME_COLORS.primary : "white";
  const textColor = variant === "primary" ? "white" : "#333333";
  const iconColor = variant === "primary" ? "white" : THEME_COLORS.primary;

  // Função de navegação melhorada para resolver problemas de retorno
  const handleBack = useCallback(() => {
    if (onBackPress) {
      // Callback personalizado tem prioridade
      onBackPress();
    } else if (backTo) {
      // Se tiver uma rota específica para voltar, use-a
      router.push(backTo as any);
    } else {
      // Tente usar o sistema de navegação interno, ou volte na história padrão
      try {
        navigateBack();
      } catch (error) {
        console.log("Erro na navegação interna, tentando router.back()", error);
        router.back();
      }
    }
  }, [onBackPress, backTo, navigateBack]);

  return (
    <SafeAreaView
      className={`${variant === "primary" ? "bg-primary-500" : "bg-white"} ${
        variant === "white" ? "border-b border-gray-200" : ""
      } ${isWeb ? "sticky top-0 z-50" : ""}`}
      style={{
        backgroundColor: bgColor,
        paddingTop: Platform.OS === "android" ? insets.top : undefined,
      }}
    >
      <View
        className="px-4 py-4 shadow-md"
        style={{
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        {/* Layout para mobile */}
        {!isWeb && (
          <View>
            {/* Header com botão voltar, título e conteúdo à direita em uma única linha */}
            <View className="flex-row items-center mb-2">
              {showBackButton && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="p-2 -ml-2 rounded-full active:bg-white/20 mr-2"
                >
                  <ChevronLeft size={28} color={iconColor} />
                </TouchableOpacity>
              )}

              {/* Título e Subtítulo */}
              <View className="flex-1">
                <Text
                  className={`text-2xl font-bold ${
                    variant === "primary" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    className={`text-sm ${
                      variant === "primary" ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>

              {/* Conteúdo à direita */}
              {rightContent && <View className="ml-2">{rightContent}</View>}
            </View>
          </View>
        )}

        {/* Layout para web */}
        {isWeb && (
          <View className="w-full container md:px-4 mx-auto">
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-3 flex-1">
                {showBackButton && (
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-row items-center p-1 rounded-full hover:bg-white/20"
                  >
                    <ChevronLeft size={24} color={iconColor} />
                  </TouchableOpacity>
                )}

                <VStack className="flex-1">
                  <Text
                    className={`text-lg font-bold ${
                      variant === "primary" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {title}
                  </Text>
                  {subtitle && (
                    <Text
                      className={`text-sm ${
                        variant === "primary"
                          ? "text-white/80"
                          : "text-gray-500"
                      } w-full`}
                    >
                      {subtitle}
                    </Text>
                  )}
                </VStack>
              </HStack>

              {/* Conteúdo à direita para web */}
              {rightContent && <View>{rightContent}</View>}
            </HStack>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
