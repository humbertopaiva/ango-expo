// Path: src/features/leaflets/screens/leaflets-screen.tsx
import React from "react";
import { LeafletsProvider } from "../contexts/leaflets-provider";
import { LeafletsContent } from "./leaflets-content";
import { View } from "react-native";
import ScreenHeader from "@/components/ui/screen-header";

export function LeafletsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Encartes"
        subtitle="Gerencie os encartes promocionais da sua loja"
        showBackButton={true}
      />
      <LeafletsProvider>
        <LeafletsContent />
      </LeafletsProvider>
    </View>
  );
}
