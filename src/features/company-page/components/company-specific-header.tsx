// Path: src/features/company-page/components/company-specific-header.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";
import { Box } from "@/components/ui/box";
import { useCategoryFilterStore } from "../stores/category-filter.store";

interface CompanySpecificHeaderProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  onBackPress?: () => void;
  backTo?: string;
}

export function CompanySpecificHeader({
  title,
  subtitle,
  primaryColor = "#4B5563", // gray-700 default
  onBackPress,
  backTo,
}: CompanySpecificHeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  // Use the category filter store
  const { categories, selectedCategory, setSelectedCategory, isVisible } =
    useCategoryFilterStore();

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
            {subtitle && (
              <Text className="text-xs text-white/80" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
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

      {/* Show categories when the original filter is not visible */}
      {!isVisible && categories.length > 0 && (
        <View
          className="pb-2"
          style={{
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.1)",
            backgroundColor: primaryColor,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor: isActive
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.2)",
                    marginRight: 10,
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: isActive ? primaryColor : "#FFFFFF",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: 12,
                    }}
                    numberOfLines={1}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
