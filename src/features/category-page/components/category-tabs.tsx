// Path: src/features/category-page/components/category-tabs.tsx

import React from "react";
import { View } from "react-native";
import { SimpleTabs } from "./simple-tabs";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryTabsProps {
  activeTab: "highlights" | "companies";
  onTabChange: (tab: "highlights" | "companies") => void;
  companyCount: number;
  highlightCount: number;
}

export function CategoryTabs({
  activeTab,
  onTabChange,
  companyCount,
  highlightCount,
}: CategoryTabsProps) {
  const tabs = [
    {
      key: "highlights",
      title: "Destaques",
      badge: highlightCount > 0 ? highlightCount : undefined,
    },
    {
      key: "companies",
      title: "Empresas",
      badge: companyCount > 0 ? companyCount : undefined,
    },
  ];

  const handleTabChange = (tabKey: string) => {
    onTabChange(tabKey as "highlights" | "companies");
  };

  return (
    <View className="mb-6 border-b border-gray-200">
      <SimpleTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        primaryColor={THEME_COLORS.primary}
        centered={false}
      />
    </View>
  );
}
