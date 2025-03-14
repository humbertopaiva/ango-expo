// Path: app/empresa/[companySlug]/orders.tsx
import React from "react";
import { View } from "react-native";
import { OrdersScreen } from "@/src/features/orders/screens/orders-screen";

export default function OrdersPage() {
  return (
    <View className="flex-1">
      <OrdersScreen />
    </View>
  );
}
