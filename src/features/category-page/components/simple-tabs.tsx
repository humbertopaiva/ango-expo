// Path: src/features/category-page/components/simple-tabs.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface TabItem {
  key: string;
  title: string;
  badge?: number;
}

interface SimpleTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  primaryColor?: string;
  centered?: boolean;
}

export function SimpleTabs({
  tabs,
  activeTab,
  onTabChange,
  primaryColor = THEME_COLORS.primary,
  centered = false,
}: SimpleTabsProps) {
  const { width } = useWindowDimensions();
  const tabWidth = width / tabs.length;

  // Animação para o indicador
  const tabIndicatorPosition = React.useRef(
    new Animated.Value(
      tabs.findIndex((tab) => tab.key === activeTab) * tabWidth
    )
  ).current;

  React.useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
    Animated.spring(tabIndicatorPosition, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [activeTab, tabs, tabWidth]);

  return (
    <View style={[styles.container, centered && styles.centered]}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, { width: tabWidth }]}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? primaryColor : "#6B7280",
                      fontFamily: isActive
                        ? "PlusJakartaSans_600SemiBold"
                        : "PlusJakartaSans_500Medium",
                    },
                  ]}
                >
                  {tab.title}
                </Text>

                {tab.badge && (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: isActive ? primaryColor : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: isActive ? "white" : "#6B7280",
                        },
                      ]}
                    >
                      {tab.badge}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            left: tabIndicatorPosition,
            backgroundColor: primaryColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  centered: {
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
  },
  tab: {
    paddingVertical: 12,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
