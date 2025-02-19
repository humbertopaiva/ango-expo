// src/components/ui/screen-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, LucideIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Button } from "@gluestack-ui/themed";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
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
                  <Button.Text>{action.label}</Button.Text>
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
          <View className="max-w-7xl mx-auto">
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                {showBackButton && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-row items-center"
                  >
                    <ArrowLeft size={20} color="#6B7280" />
                    <Text className="ml-2 text-sm text-gray-500">Voltar</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-bold text-center text-gray-900">
                  {title}
                </Text>
                {subtitle && (
                  <Text className="text-sm text-center text-gray-500 mt-1">
                    {subtitle}
                  </Text>
                )}
              </View>

              <View className="flex-1 flex-row justify-end">
                {action && (
                  <Button onPress={action.onPress} size="sm">
                    {action.icon && (
                      <View className="mr-2">
                        {React.createElement(action.icon, {
                          size: 16,
                          color: "white",
                        })}
                      </View>
                    )}
                    <Button.Text>{action.label}</Button.Text>
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
