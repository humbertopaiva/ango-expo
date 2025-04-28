// Path: src/features/company-page/components/sticky-category-filter.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";

interface StickyCategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isSticky: boolean;
}

export function StickyCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isSticky,
}: StickyCategoryFilterProps) {
  const vm = useCompanyPageContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get the primary color from the view model
  const primaryColor = vm.primaryColor || "#F4511E";

  // Animation effect when filter becomes sticky
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isSticky ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSticky]);

  // Scroll to the selected category when it changes
  useEffect(() => {
    if (selectedCategory && scrollViewRef.current) {
      // Find the index of the selected category
      const index = categories.indexOf(selectedCategory);
      if (index !== -1) {
        // Calculate approximate scroll position (this is an estimation)
        const position = index * 120; // Assuming each category takes about 120px
        scrollViewRef.current.scrollTo({ x: position, animated: true });
      }
    }
  }, [selectedCategory, categories]);

  return (
    <Animated.View
      style={[
        styles.container,
        isSticky && styles.sticky,
        {
          backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["transparent", "#ffffff"],
          }),
          shadowOpacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-5, 0],
              }),
            },
          ],
        },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              style={[
                styles.categoryButton,
                isActive && { backgroundColor: primaryColor },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: "100%",
    zIndex: 10,
  },
  sticky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    ...Platform.select({
      web: {
        position: "sticky",
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryButton: {
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
