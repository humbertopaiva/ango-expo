// Path: app/empresa/[companySlug]/product/[productId].tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { CompanyPageProvider } from "@/src/features/company-page/contexts/company-page-provider";
import { ProductDetailsScreen } from "@/src/features/company-page/screens/product-details-screen";
import { View } from "react-native";

export default function ProductDetailsPage() {
  const { companySlug, productId } = useLocalSearchParams<{
    companySlug: string;
    productId: string;
  }>();

  if (!companySlug || !productId) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      <CompanyPageProvider companySlug={companySlug}>
        <ProductDetailsScreen />
      </CompanyPageProvider>
    </View>
  );
}
