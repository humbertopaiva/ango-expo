// Path: components/ui/enhanced-screen-header.tsx
import React from "react";
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

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  variant?: "primary" | "white";
  onBackPress?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  showBackButton = true,
  backTo = "/admin/dashboard",
  variant = "primary",
  onBackPress,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const bgColor = variant === "primary" ? THEME_COLORS.primary : "white";
  const textColor = variant === "primary" ? "white" : "#333333";
  const iconColor = variant === "primary" ? "white" : THEME_COLORS.primary;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (backTo) {
      router.push(backTo as any);
    } else {
      router.back();
    }
  };

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
        className="px-4 py-4"
        style={{
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        {/* Layout para mobile */}
        {!isWeb && (
          <View className="gap-2">
            {/* Header com botão voltar */}
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBack}
                className="p-2 -ml-2 rounded-full active:bg-white/20"
              >
                <ChevronLeft size={28} color={iconColor} />
              </TouchableOpacity>
            )}

            {/* Título e Subtítulo */}
            <View className="gap-1 w-full">
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
                  } w-full`}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Layout para web */}
        {isWeb && (
          <View className="w-full container md:px-4 mx-auto">
            <HStack className="items-center gap-3">
              {showBackButton && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center p-1 rounded-full hover:bg-white/20"
                >
                  <ChevronLeft size={24} color={iconColor} />
                </TouchableOpacity>
              )}

              <VStack className="w-full">
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
                      variant === "primary" ? "text-white/80" : "text-gray-500"
                    } w-full`}
                  >
                    {subtitle}
                  </Text>
                )}
              </VStack>
            </HStack>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
