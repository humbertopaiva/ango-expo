// Path: app/empresa/[companySlug]/checkout.tsx
import React from "react";
import { View } from "react-native";
import { CheckoutScreen } from "@/src/features/checkout/screens/checkout-screen";

export default function CheckoutPage() {
  return (
    <View className="flex-1">
      <CheckoutScreen />
    </View>
  );
}
