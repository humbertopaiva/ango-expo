// src/features/company-page/screens/company-page.tsx
import React from "react";
import { CompanyPageProvider } from "../contexts/company-page-provider";
import { CompanyPageContent } from "./company-page-content";
import { useLocalSearchParams } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { View } from "react-native";

export function CompanyPage() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  if (!companySlug) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Empresa"
        subtitle="Detalhes e produtos"
        showBackButton={true}
        backTo="/(drawer)/(tabs)/comercio-local"
      />
      <CompanyPageProvider companySlug={companySlug}>
        <CompanyPageContent />
      </CompanyPageProvider>
    </View>
  );
}
