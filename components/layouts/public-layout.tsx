// src/components/layouts/public-layout.tsx
import React from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayoutContainer({ children }: PublicLayoutProps) {
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View
        className={`flex-1 ${isWeb ? "md:pl-0" : ""}`}
        // // Adiciona espaço para a tab bar
        // style={{ paddingBottom: 65 }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
