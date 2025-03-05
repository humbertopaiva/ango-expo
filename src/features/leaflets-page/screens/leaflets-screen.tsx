// src/features/leaflets/screens/leaflets-screen.tsx
import React from "react";
import { View } from "react-native";
import { LeafletsProvider } from "../contexts/leaflets-provider";
import { LeafletsContent } from "./leaflets-content";
import ScreenHeader from "@/components/ui/screen-header";

export function LeafletsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Encartes"
        subtitle="Veja as melhores ofertas"
        showBackButton={false}
      />
      <LeafletsProvider>
        <LeafletsContent />
      </LeafletsProvider>
    </View>
  );
}
