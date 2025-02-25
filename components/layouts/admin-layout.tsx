// src/components/layouts/admin-layout.tsx
import React from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayoutContainer({ children }: AdminLayoutProps) {
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View
        className={`flex-1 ${isWeb ? "md:pl-0" : ""}`}
        // Adiciona espaço para a tab bar
        // style={{ paddingBottom: 65 }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
