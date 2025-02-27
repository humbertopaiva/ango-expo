// components/navigation/admin-screen-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, usePathname, router } from "expo-router";
import { ArrowLeft, Menu } from "lucide-react-native";
import { DrawerActions } from "@react-navigation/native";

interface AdminScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
}

export function AdminScreenHeader({
  title,
  showBackButton = true,
  backTo = "/admin/dashboard",
}: AdminScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (backTo) {
      router.push(backTo as any);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={styles.menuButton}
            >
              <Menu size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightSection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4511E",
    paddingBottom: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 56,
  },
  leftSection: {
    position: "absolute",
    left: 16,
    zIndex: 10,
  },
  rightSection: {
    width: 40, // Para manter o título centralizado
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
});
