// Path: app/(drawer)/admin/products/variations/types.tsx
import React from "react";
import { VariationTypesScreen } from "@/src/features/products/screens/variation-types-screen";
import { View } from "react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";

export default function VariationTypesPage() {
  return (
    <View className="flex-1 bg-white">
      <VariationTypesScreen />
    </View>
  );
}
