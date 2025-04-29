// Path: src/features/company-page/components/company-specific-header.tsx
import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
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
  Easing,
  FadeIn,
  FadeOut,
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
      style={[
        styles.categoryButton,
        {
          backgroundColor: isActive ? "#FFFFFF" : "rgba(255,255,255,0.2)",
          shadowColor: isActive ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isActive ? 0.2 : 0,
          shadowRadius: isActive ? 3 : 0,
          elevation: isActive ? 3 : 0,
        },
      ]}
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
            style={[
              styles.countBadge,
              {
                backgroundColor: isActive
                  ? `${primaryColor}20`
                  : "rgba(255,255,255,0.3)",
              },
            ]}
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

  // Use the header opacity as an animated value
  const headerOpacity = useSharedValue(0);
  const headerHeight = useSharedValue(0);

  // Use the category filter store
  const { categories, selectedCategory, setSelectedCategory, productCounts } =
    useCategoryFilterStore();

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

  // Altura máxima do header quando expandido (incluindo categorias)
  const HEADER_BASE_HEIGHT = Platform.OS === "ios" ? insets.top + 56 : 56;
  const CATEGORIES_SECTION_HEIGHT = 60;
  const HEADER_EXPANDED_HEIGHT = HEADER_BASE_HEIGHT + CATEGORIES_SECTION_HEIGHT;

  // Monitor scroll position to show/hide header with smooth transition
  useEffect(() => {
    // Add a threshold to avoid changes with small oscillations
    const THRESHOLD = 10;
    const SCROLL_TRIGGER = 300;

    if (scrollPosition > SCROLL_TRIGGER + THRESHOLD) {
      // Animation to show the header
      headerOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      headerHeight.value = withTiming(HEADER_EXPANDED_HEIGHT, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else if (scrollPosition < SCROLL_TRIGGER - THRESHOLD) {
      // Animation to hide the header
      headerOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      headerHeight.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [scrollPosition, headerOpacity, headerHeight, HEADER_EXPANDED_HEIGHT]);

  // Create animated styles using the opacity and height
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      height: headerHeight.value,
      overflow: "hidden",
    };
  });

  // Render the animated header
  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { backgroundColor: primaryColor },
        animatedHeaderStyle,
        isWeb ? { position: "sticky", top: 0, zIndex: 50 } : {},
      ]}
    >
      {/* Main header with back button and title */}
      <View style={{ height: HEADER_BASE_HEIGHT, justifyContent: "flex-end" }}>
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
      </View>

      {/* Categories section */}
      <View style={{ height: CATEGORIES_SECTION_HEIGHT }}>
        {categories.length > 0 && (
          <Animated.View
            style={styles.categoriesContent}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {categories.map((category, index) => {
                const isActive = selectedCategory === category;
                // Get the count of products in this category
                const count = productCounts[category] || 0;

                return (
                  <Animated.View
                    key={category}
                    entering={FadeIn.duration(400).delay(
                      30 * Math.min(index, 5)
                    )}
                  >
                    <CategoryButton
                      category={category}
                      isActive={isActive}
                      count={count}
                      primaryColor={primaryColor}
                      onSelect={() => setSelectedCategory(category)}
                    />
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  categoriesContent: {
    height: "100%",
    justifyContent: "center",
  },
  categoryButton: {
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  countBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
});
