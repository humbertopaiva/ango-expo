// Path: src/features/delivery/screens/delivery-screen.tsx
import React from "react";
import { DeliveryScreenContent } from "./delivery-screen-content";
import { View } from "react-native";
import { DeliveryProvider } from "../contexts/delivery-page-provider";

export function DeliveryScreen() {
  return (
    <View className="flex-1 bg-background">
      <DeliveryProvider>
        <DeliveryScreenContent />
      </DeliveryProvider>
    </View>
  );
}
