// Path: app/(drawer)/empresa/[companySlug]/orders/[orderId].tsx
import React from "react";
import { View } from "react-native";
import { OrderDetailsScreen } from "@/src/features/orders/screens/order-details-screen";

export default function OrderDetailPage() {
  return (
    <View className="flex-1">
      <OrderDetailsScreen />
    </View>
  );
}
