// Path: src/features/company-page/components/company-specific-header.tsx
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
import { Box } from "@/components/ui/box";

interface CompanySpecificHeaderProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  onBackPress?: () => void;
  backTo?: string;
}

/**
 * Header específico para a página da empresa, com fundo branco e texto na cor primária
 * Este componente não afeta outros headers na aplicação
 */
export function CompanySpecificHeader({
  title,
  subtitle,
  primaryColor = "#4B5563", // gray-700 default
  onBackPress,
  backTo,
}: CompanySpecificHeaderProps) {
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
      className="bg-primary-500"
      style={[
        isWeb ? { position: "sticky", top: 0, zIndex: 50 } : {},
        {
          paddingTop: Platform.OS === "ios" ? insets.top : 0,
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
            <ArrowLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>

          <View className="ml-2 flex-1">
            <Text
              className="text-xl font-semibold text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </HStack>

        {/* Logo da aplicação */}
        <Box className="mr-1">
          <Image
            source={require("@/assets/images/logo-white.png")}
            className="h-8 w-16"
            resizeMode="contain"
          />
        </Box>
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
