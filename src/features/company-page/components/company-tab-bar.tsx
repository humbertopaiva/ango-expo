import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, ShoppingBag, Clock, User } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { THEME_COLORS } from "@/src/styles/colors";

interface CompanyTabBarProps {
  activeTab?: "home" | "cart" | "orders" | "profile";
}

export function CompanyTabBar({ activeTab = "home" }: CompanyTabBarProps) {
  const insets = useSafeAreaInsets();
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  // Get company slug for navigation
  const companySlug = vm.profile?.empresa.slug || "";

  // Primary color for background
  const primaryColor = THEME_COLORS.primary;

  // Navigation functions
  const navigateToHome = () => {
    router.push(`/(drawer)/empresa/${companySlug}` as any);
  };

  const navigateToCart = () => {
    router.push(`/(drawer)/empresa/${companySlug}/cart` as any);
  };

  const navigateToOrders = () => {
    router.push(`/(drawer)/empresa/${companySlug}/orders` as any);
  };

  const navigateToProfile = () => {
    router.push(`/(drawer)/profile` as any);
  };

  // Tab item component
  const TabItem = ({
    icon: Icon,
    label,
    badge,
    isActive,
    onPress,
  }: {
    icon: any;
    label: string;
    badge?: number;
    isActive: boolean;
    onPress: () => void;
  }) => {
    // Animation style for the active indicator
    const indicatorStyle = useAnimatedStyle(() => {
      return {
        opacity: withSpring(isActive ? 1 : 0),
        transform: [{ translateY: withSpring(isActive ? 0 : 10) }],
      };
    });

    return (
      <TouchableOpacity
        style={styles.tabItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Icon
            size={24}
            color={isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)"}
          />

          {/* Badge indicator for cart */}
          {badge && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.label,
            { color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)" },
          ]}
        >
          {label}
        </Text>

        {/* Active indicator dot */}
        <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
      </TouchableOpacity>
    );
  };

  // Calculate safe bottom padding
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomPadding,
          width: isWeb ? Math.min(width, 768) : "100%",
          backgroundColor: primaryColor,
        },
      ]}
    >
      <TabItem
        icon={Home}
        label="Início"
        isActive={activeTab === "home"}
        onPress={navigateToHome}
      />

      <TabItem
        icon={ShoppingBag}
        label="Carrinho"
        badge={cartVm.itemCount}
        isActive={activeTab === "cart"}
        onPress={navigateToCart}
      />

      <TabItem
        icon={Clock}
        label="Pedidos"
        isActive={activeTab === "orders"}
        onPress={navigateToOrders}
      />

      <TabItem
        icon={User}
        label="Perfil"
        isActive={activeTab === "profile"}
        onPress={navigateToProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    alignSelf: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    position: "relative",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFF",
    backgroundColor: "#FFFFFF",
  },
  badgeText: {
    color: THEME_COLORS.primary,
    fontSize: 10,
    fontWeight: "bold",
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    bottom: -2,
    backgroundColor: "#FFFFFF",
  },
});
