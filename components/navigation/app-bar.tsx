// components/navigation/app-bar.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { THEME_COLORS } from "@/src/styles/colors";

interface AppBarProps {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
}

export function AppBar({
  backgroundColor = `${THEME_COLORS.primary}`,
}: AppBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        paddingTop:
          Platform.OS === "ios" ? insets.top : StatusBar.currentHeight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height:
          (Platform.OS === "ios" ? insets.top : StatusBar.currentHeight || 0) +
          56,
      }}
    >
      {/* Logo */}
      <Image
        source={require("@/assets/images/logo-white.png")}
        style={{ height: 32, width: 100, resizeMode: "contain" }}
      />

      {/* Menu Toggle */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Menu size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
