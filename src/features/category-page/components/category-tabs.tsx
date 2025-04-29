// Path: src/features/category-page/components/category-tabs.tsx
import React from "react";
import { View } from "react-native";
import { SimpleTabs } from "./simple-tabs";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryTabsProps {
  companyCount: number;
}

export function CategoryTabs({ companyCount }: CategoryTabsProps) {
  // Simplificando para mostrar apenas a tab de empresas
  const tabs = [
    {
      key: "companies",
      title: "Empresas",
      badge: companyCount > 0 ? companyCount : undefined,
    },
  ];

  return (
    <View className="mb-6 border-b border-gray-200">
      <SimpleTabs
        tabs={tabs}
        activeTab="companies"
        onTabChange={() => {}} // Não precisa mudar a tab, pois só temos uma
        primaryColor={THEME_COLORS.primary}
        centered={false}
      />
    </View>
  );
}
