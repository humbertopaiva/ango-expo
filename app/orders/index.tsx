// Path: app/orders/index.tsx
import { AllOrdersScreen } from "@/src/features/orders/screens/all-orders-screen";
import React from "react";
import { View } from "react-native";

export default function AllOrdersPage() {
  return (
    <View className="flex-1">
      <AllOrdersScreen />
    </View>
  );
}
