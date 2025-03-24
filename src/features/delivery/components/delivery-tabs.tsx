// Path: src/features/delivery/components/delivery-tabs.tsx
import React from "react";
import { View } from "react-native";
import { SimpleTabs } from "@/components/custom/simple-tabs";
import { THEME_COLORS } from "@/src/styles/colors";

interface DeliveryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  companyCount: number;
  showcaseCount: number;
  vitrinesCount: number; // Nova prop para quantidade de vitrines
}

export function DeliveryTabs({
  activeTab,
  onTabChange,
  companyCount,
  showcaseCount,
  vitrinesCount, // Recebemos a contagem de vitrines
}: DeliveryTabsProps) {
  // Se não houver vitrines, criamos apenas a tab de empresas
  const hasShowcases = vitrinesCount > 0;

  const tabs = hasShowcases
    ? [
        {
          key: "featured",
          title: "Destaques",
          badge: vitrinesCount > 0 ? vitrinesCount : undefined, // Usamos a quantidade de vitrines
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
    onTabChange(tabKey);
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
        centered={true} // Mantém as tabs centralizadas
      />
    </View>
  );
}
