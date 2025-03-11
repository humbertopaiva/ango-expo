// Path: src/features/company-page/screens/company-page.tsx
import React from "react";
import { CompanyPageProvider } from "../contexts/company-page-provider";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { CompanyPageContent } from "./company-page-content";

export function CompanyPage() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  if (!companySlug) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <CompanyPageProvider companySlug={companySlug}>
        <CompanyPageContent />
      </CompanyPageProvider>
    </View>
  );
}
