// Path: src/features/company-page/components/company-specific-header.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Filter,
  ShoppingBag,
  MessageCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";
import { Box } from "@/components/ui/box";
import { useCategoryFilterStore } from "../stores/category-filter.store";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { OpenStatusIndicator } from "@/components/custom/open-status-indicator";
import { isBusinessOpen } from "@/src/utils/business-hours.utils";

interface CompanySpecificHeaderProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  onBackPress?: () => void;
  backTo?: string;
  scrollPosition?: number;
  onMoreInfoPress?: () => void;
}

export function CompanySpecificHeader({
  title,
  subtitle,
  primaryColor = "#F4511E",
  onBackPress,
  backTo,
  scrollPosition = 0,
  onMoreInfoPress,
}: CompanySpecificHeaderProps) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const companyFadeAnim = useRef(new Animated.Value(0)).current;
  const vm = useCompanyPageContext();

  // Use the category filter store
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    isVisible,
    productCounts,
  } = useCategoryFilterStore();

  // State to determine if company info should be shown (after scroll)
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);

  // Handler for back button
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (backTo) {
      router.push(backTo as any);
    } else {
      router.back();
    }
  };

  // Verify if business is open
  const isOpen = vm.profile ? isBusinessOpen(vm.profile) : false;

  // Monitor scroll position to show company info
  useEffect(() => {
    if (scrollPosition > 100) {
      setShowCompanyInfo(true);
      Animated.timing(companyFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(companyFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setShowCompanyInfo(false);
      });
    }
  }, [scrollPosition, companyFadeAnim]);

  // Animate the categories appearance when visibility changes
  useEffect(() => {
    if (!isVisible && categories.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(-10);
    }
  }, [isVisible, categories.length]);

  // Only show categories if there are categories AND they're not visible in the main view
  const shouldShowCategories = !isVisible && categories.length > 0;

  // Handler for WhatsApp contact
  const handleWhatsAppContact = () => {
    const whatsappLink = vm.getWhatsAppLink();
    if (whatsappLink) {
      window.open(whatsappLink, "_blank");
    }
  };

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

          {/* When scrolled down, show company info */}
          {showCompanyInfo ? (
            <Animated.View
              style={{
                opacity: companyFadeAnim,
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <VStack className="ml-2 flex-1">
                <Text
                  className="text-xl font-semibold text-white"
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <HStack alignItems="center" space="xs">
                  {isOpen !== undefined && (
                    <OpenStatusIndicator
                      isOpen={isOpen}
                      size="sm"
                      className="bg-white/10"
                    />
                  )}
                  {subtitle && (
                    <Text className="text-xs text-white/80" numberOfLines={1}>
                      {subtitle}
                    </Text>
                  )}
                </HStack>
              </VStack>

              {/* Action buttons when showing company info */}
              <HStack space="sm">
                {vm.profile?.whatsapp && (
                  <TouchableOpacity
                    onPress={handleWhatsAppContact}
                    className="p-2 rounded-full bg-white/20"
                  >
                    <MessageCircle size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                {onMoreInfoPress && (
                  <TouchableOpacity
                    onPress={onMoreInfoPress}
                    className="p-2 rounded-full bg-white/20"
                  >
                    <Filter size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </HStack>
            </Animated.View>
          ) : (
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
          )}
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

      {/* Categories horizontal scroll - only shown when the main filter is not visible */}
      {shouldShowCategories && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.15)",
          }}
          className="pb-2 pt-1"
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
              // Get the count of products in this category
              const count = productCounts[category] || 0;

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
              );
            })}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}
