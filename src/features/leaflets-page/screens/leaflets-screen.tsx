// src/features/leaflets/screens/leaflets-screen.tsx
import React from "react";
import { View } from "react-native";
import { LeafletsProvider } from "../contexts/leaflets-provider";
import { LeafletsContent } from "./leaflets-content";

export function LeafletsScreen() {
  return (
    <View className="flex-1 bg-background">
      <LeafletsProvider>
        <LeafletsContent />
      </LeafletsProvider>
    </View>
  );
}
