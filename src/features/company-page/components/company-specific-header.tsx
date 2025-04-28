// Path: src/features/company-page/components/company-specific-header.tsx
import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";
import { Box } from "@/components/ui/box";
import { useCategoryFilterStore } from "../stores/category-filter.store";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

interface CompanySpecificHeaderProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  onBackPress?: () => void;
  backTo?: string;
  scrollPosition?: number;
}

// Componente de categoria para evitar renderizações desnecessárias
const CategoryButton = memo(
  ({
    category,
    isActive,
    count,
    primaryColor,
    onSelect,
  }: {
    category: string;
    isActive: boolean;
    count: number;
    primaryColor: string;
    onSelect: () => void;
  }) => (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        backgroundColor: isActive ? "#FFFFFF" : "rgba(255,255,255,0.2)",
        marginRight: 10,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        shadowColor: isActive ? "#000" : "transparent",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.2 : 0,
        shadowRadius: isActive ? 3 : 0,
        elevation: isActive ? 3 : 0,
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <Text
          style={{
            color: isActive ? primaryColor : "#FFFFFF",
            fontWeight: isActive ? "700" : "500",
            fontSize: 13,
          }}
          numberOfLines={1}
        >
          {category}
        </Text>

        {/* Only show badge if count is available */}
        {count > 0 && (
          <View
            style={{
              backgroundColor: isActive
                ? `${primaryColor}20`
                : "rgba(255,255,255,0.3)",
              borderRadius: 10,
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginLeft: 6,
            }}
          >
            <Text
              style={{
                color: isActive ? primaryColor : "#FFFFFF",
                fontSize: 10,
                fontWeight: "600",
              }}
            >
              {count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
);

export function CompanySpecificHeader({
  title,
  subtitle,
  primaryColor = "#F4511E",
  onBackPress,
  backTo,
  scrollPosition = 0,
}: CompanySpecificHeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  // Using Reanimated shared values
  const categoriesOpacity = useSharedValue(0);
  const categoriesHeight = useSharedValue(0);

  // Use the category filter store
  const { categories, selectedCategory, setSelectedCategory, productCounts } =
    useCategoryFilterStore();

  // Determine if categories should be shown (after scroll)
  const [showCategories, setShowCategories] = useState(false);

  // Handler for back button - usando useCallback
  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else if (backTo) {
      router.push(backTo as any);
    } else {
      router.back();
    }
  }, [onBackPress, backTo]);

  // Monitor scroll position to show categories - Alterado para 300px conforme solicitado
  useEffect(() => {
    if (scrollPosition > 300) {
      setShowCategories(true);
      categoriesOpacity.value = withTiming(1, { duration: 300 });
      categoriesHeight.value = withTiming(1, { duration: 300 });
    } else {
      categoriesOpacity.value = withTiming(0, { duration: 200 });
      categoriesHeight.value = withTiming(0, { duration: 200 });

      // Small delay to hide categories after animation
      const timeout = setTimeout(() => {
        if (scrollPosition <= 300) {
          setShowCategories(false);
        }
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [scrollPosition, categoriesOpacity, categoriesHeight]);

  // Create animated styles using Reanimated
  const animatedCategoriesStyle = useAnimatedStyle(() => {
    return {
      opacity: categoriesOpacity.value,
      maxHeight: interpolate(
        categoriesHeight.value,
        [0, 1],
        [0, 60],
        Extrapolate.CLAMP
      ),
      overflow: "hidden",
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.15)",
    };
  });

  return (
    <View
      style={[
        {
          backgroundColor: primaryColor,
          paddingTop: Platform.OS === "ios" ? insets.top : 0,
        },
        isWeb ? { position: "sticky", top: 0, zIndex: 50 } : {},
      ]}
    >
      {/* Main header with back button and title */}
      <HStack className="px-4 py-3 justify-between items-center" space="md">
        <HStack className="items-center flex-1" space="sm">
          <TouchableOpacity
            onPress={handleBack}
            className="p-2 -ml-2 rounded-full active:bg-white/10"
          >
            <ArrowLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>

          {/* Company title and subtitle */}
          <VStack className="ml-2 flex-1">
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
          </VStack>
        </HStack>

        {/* Logo */}
        <Box className="mr-1">
          <Image
            source={require("@/assets/images/logo-white.png")}
            className="h-8 w-16"
            resizeMode="contain"
          />
        </Box>
      </HStack>

      {/* Categories horizontal scroll - shown only after scrolling down 300px */}
      <Animated.View style={animatedCategoriesStyle}>
        {showCategories && categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              // Get the count of products in this category
              const count = productCounts[category] || 0;

              return (
                <CategoryButton
                  key={category}
                  category={category}
                  isActive={isActive}
                  count={count}
                  primaryColor={primaryColor}
                  onSelect={() => setSelectedCategory(category)}
                />
              );
            })}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}
