// Path: src/features/delivery/screens/delivery-screen.tsx
import React, { useEffect } from "react";
import { View } from "react-native";

import { DeliveryScreenContent } from "./delivery-screen-content";
import { DeliveryProvider } from "../contexts/delivery-page-provider";

export function DeliveryScreen() {
  // Log para depuração
  useEffect(() => {
    console.log("DeliveryScreen mounted");

    return () => {
      console.log("DeliveryScreen unmounted");
    };
  }, []);

  return (
    <View className="flex-1 bg-background">
      <DeliveryProvider>
        <DeliveryScreenContent />
      </DeliveryProvider>
    </View>
  );
}
