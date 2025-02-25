// src/components/ui/screen-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, LucideIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

import { HStack } from "./hstack";
import { VStack } from "./vstack";
import { Button, ButtonText } from "./button";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label?: string;
    icon?: LucideIcon;
    onPress: () => void;
  };
  showBackButton?: boolean;
}

export default function ScreenHeader({
  title,
  subtitle,
  action,
  showBackButton = true,
}: ScreenHeaderProps) {
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView
      className={`bg-white border-b border-gray-200 
        ${isWeb ? "sticky top-0 z-50" : ""}`}
    >
      <View className="px-4 py-4">
        {/* Layout para mobile */}
        {!isWeb && (
          <View className="space-y-2">
            {/* Header com botão voltar e ação */}
            <View className="flex-row items-center justify-between">
              {showBackButton && (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="p-2 -ml-2"
                >
                  <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
              )}

              {action && (
                <Button onPress={action.onPress} className="ml-auto" size="sm">
                  {action.icon && (
                    <View className="mr-2">
                      {React.createElement(action.icon, {
                        size: 16,
                        color: "white",
                      })}
                    </View>
                  )}
                  <ButtonText>{action.label}</ButtonText>
                </Button>
              )}
            </View>

            {/* Título e Subtítulo */}
            <View className="space-y-1">
              <Text className="text-2xl font-bold text-gray-900">{title}</Text>
              {subtitle && (
                <Text className="text-sm text-gray-500">{subtitle}</Text>
              )}
            </View>
          </View>
        )}

        {/* Layout para web */}
        {isWeb && (
          <View className="w-full container md:px-4 mx-auto">
            <View className="flex-row items-center justify-between py-2">
              <HStack className="flex-1 items-center gap-3">
                <View className="">
                  {showBackButton && (
                    <TouchableOpacity
                      onPress={() => router.back()}
                      className="flex-row items-center"
                    >
                      <ArrowLeft size={20} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>

                <VStack className="">
                  <Text className="text-lg font-bold text-center text-gray-900">
                    {title}
                  </Text>
                  {/* {subtitle && (
                    <Text className="text-sm text-center text-gray-500 mt-1">
                      {subtitle}
                    </Text>
                  )} */}
                </VStack>
              </HStack>

              <View className="flex-1 flex-row justify-end">
                {action && (
                  <Button
                    onPress={action.onPress}
                    size="sm"
                    className="p-2 rounded-full flex justify-center items-center"
                  >
                    {action.icon && (
                      <View>
                        {React.createElement(action.icon, {
                          size: 14,
                          color: "white",
                        })}
                      </View>
                    )}
                    <ButtonText className="font-sans text-xs">
                      {action.label}
                    </ButtonText>
                  </Button>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
