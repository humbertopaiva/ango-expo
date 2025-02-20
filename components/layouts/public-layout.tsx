// src/components/ui/public-layout.tsx
import React from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PublicNavigation } from "../navigation/public-navigation";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayoutContainer({ children }: PublicLayoutProps) {
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PublicNavigation />
      <View className={`flex-1 ${isWeb ? "md:pl-64" : ""}`}>{children}</View>
    </SafeAreaView>
  );
}
