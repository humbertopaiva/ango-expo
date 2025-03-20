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
  hasVitrines: boolean; // Nova propriedade para verificar se há vitrines disponíveis
}

export function CategoryTabs({
  activeTab,
  onTabChange,
  companyCount,
  highlightCount,
  hasVitrines,
}: CategoryTabsProps) {
  // Se não houver vitrines, criamos apenas a tab de empresas
  const tabs = hasVitrines
    ? [
        {
          key: "highlights",
          title: "Destaques",
        },
        {
          key: "companies",
          title: "Empresas",
          badge: companyCount > 0 ? companyCount : undefined,
        },
      ]
    : [
        {
          key: "companies",
          title: "Empresas",
          badge: companyCount > 0 ? companyCount : undefined,
        },
      ];

  const handleTabChange = (tabKey: string) => {
    onTabChange(tabKey as "highlights" | "companies");
  };

  // Se houver apenas uma tab, não há necessidade de exibir o componente de tabs
  if (tabs.length === 1) {
    return null;
  }

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
