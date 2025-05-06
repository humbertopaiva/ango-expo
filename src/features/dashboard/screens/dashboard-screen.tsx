// Path: src/features/dashboard/screens/dashboard-screen.tsx
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { Menu } from "lucide-react-native";
import { DrawerActions } from "@react-navigation/native";

import { THEME_COLORS } from "@/src/styles/colors";
import { useCompanyDetails } from "../hooks/use-company-details";
import { Box } from "@/components/ui/box";
import { ModernDashboard } from "../components/modern-dashboard";

export default function DashboardScreen() {
  const { company, isLoading } = useCompanyDetails();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header with fixed color */}
      <View
        style={[
          styles.header,
          { backgroundColor: THEME_COLORS.primary, paddingTop: insets.top },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Menu size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Box className="flex-1">
          <ModernDashboard
            company={company}
            isLoading={isLoading}
            onMenuItemPress={(path) => router.push(path as any)}
          />
        </Box>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Changed to white for a cleaner look
  },
  header: {
    backgroundColor: "#F4511E",
  },
  headerContent: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logoContainer: {
    height: 40,
    width: 150,
    justifyContent: "center",
  },
  logo: {
    height: 40,
    width: 80,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  scrollContent: {
    flexGrow: 1,
  },
});
