// Path: components/custom/simple-tabs.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";

export interface TabItem {
  key: string;
  title: string;
  badge?: number;
}

interface SimpleTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  tabStyle?: "underline" | "pill" | "button";
}

export function SimpleTabs({
  tabs,
  activeTab,
  onTabChange,
  tabStyle = "underline",
}: SimpleTabsProps) {
  // Estilos com base no tipo de tab
  const getTabStyles = (isActive: boolean, style: string) => {
    if (style === "pill") {
      return {
        container: isActive
          ? "bg-primary-500 rounded-full py-2 px-4"
          : "bg-gray-100 rounded-full py-2 px-4",
        text: isActive ? "text-white font-medium" : "text-gray-700 font-medium",
      };
    } else if (style === "button") {
      return {
        container: isActive
          ? "bg-primary-500 py-2 px-4 rounded-lg"
          : "bg-white border border-gray-200 py-2 px-4 rounded-lg",
        text: isActive ? "text-white font-medium" : "text-gray-700 font-medium",
      };
    } else {
      return {
        container: "py-2 px-4",
        text: isActive
          ? "text-primary-600 font-medium"
          : "text-gray-500 font-medium",
        underline: isActive ? "border-b-2 border-primary-500" : "",
      };
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
    >
      <View className="flex-row">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const styles = getTabStyles(isActive, tabStyle);

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              className={`mr-2 ${styles.container} ${
                styles.underline || ""
              } flex-row items-center`}
            >
              <Text className={styles.text}>{tab.title}</Text>
              {tab.badge !== undefined && (
                <View
                  className={`ml-2 rounded-full px-2 py-0.5 ${
                    isActive ? "bg-white/20" : "bg-primary-500"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      isActive ? "text-white" : "text-white"
                    }`} // Path: components/custom/simple-tabs.tsx (continuação)
                  >
                    {tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
