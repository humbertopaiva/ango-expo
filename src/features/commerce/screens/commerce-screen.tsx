// Path: src/features/commerce/screens/commerce-screen.tsx
import React from "react";
import { CommerceProvider } from "../contexts/commerce-provider";
import { CommerceScreenContent } from "./commerce-screen-content";
import ScreenHeader from "@/components/ui/screen-header";
import { View } from "react-native";

export function CommerceScreen() {
  return (
    <View className="flex-1 bg-background">
      <CommerceProvider>
        <CommerceScreenContent />
      </CommerceProvider>
    </View>
  );
}
