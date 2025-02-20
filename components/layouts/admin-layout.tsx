// src/components/ui/admin-layout.tsx
import React from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminNavigation } from "../navigation/admin-navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayoutContainer({ children }: AdminLayoutProps) {
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminNavigation />
      <View className={`flex-1 ${isWeb ? "md:pl-64" : ""}`}>{children}</View>
    </SafeAreaView>
  );
}
