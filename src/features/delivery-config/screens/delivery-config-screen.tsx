// Path: src/features/delivery-config/screens/delivery-config-screen.tsx

import React from "react";
import { DeliveryConfigProvider } from "../contexts/delivery-config-provider";
import { DeliveryConfigContent } from "./delivery-config-content";
import { View } from "react-native";
import ScreenHeader from "@/components/ui/screen-header";

export function DeliveryConfigScreen() {
  return (
    <View className="flex-1 bg-background">
      <DeliveryConfigProvider>
        <DeliveryConfigContent />
      </DeliveryConfigProvider>
    </View>
  );
}
