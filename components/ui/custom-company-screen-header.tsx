// Path: components/ui/custom-company-screen-header.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";

interface CustomCompanyScreenHeaderProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  onBackPress?: () => void;
  backTo?: string;
}

export function CustomCompanyScreenHeader({
  title,
  subtitle,
  primaryColor = "#4B5563", // gray-700 default
  onBackPress,
  backTo,
}: CustomCompanyScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  // Handler para voltar
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
    <View
      className="bg-white border-b border-gray-200"
      style={[
        isWeb ? { position: "sticky", top: 0, zIndex: 50 } : {},
        {
          paddingTop: Platform.OS === "ios" ? insets.top : insets.top,
        },
      ]}
    >
      <HStack className="px-4 py-3 justify-between items-center" space="md">
        {/* Botão voltar e título */}
        <HStack className="items-center flex-1" space="sm">
          <TouchableOpacity
            onPress={handleBack}
            className="p-2 -ml-2 rounded-full active:bg-gray-100"
          >
            <ArrowLeft size={24} color={primaryColor} />
          </TouchableOpacity>

          <View className="ml-2 flex-1">
            <Text
              className="text-xl font-semibold"
              style={{ color: primaryColor }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </HStack>

        {/* Logo da aplicação */}
        <Image
          source={require("@/assets/images/logo-white.png")}
          className="h-8 w-24"
          resizeMode="contain"
        />
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
});
