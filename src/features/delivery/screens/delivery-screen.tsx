// Path: src/features/delivery/screens/delivery-screen.tsx
import React from "react";
import { View } from "react-native";

import { DeliveryScreenContent } from "./delivery-screen-content";
import { DeliveryProvider } from "../contexts/delivery-page-provider";

export function DeliveryScreen() {
  return (
    <View className="flex-1 bg-white">
      <DeliveryProvider>
        <DeliveryScreenContent />
      </DeliveryProvider>
    </View>
  );
}
