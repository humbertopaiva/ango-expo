// components/ui/simple-tabs.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
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
  fullWidth?: boolean;
  primaryColor?: string;
  tabStyle?: "pill" | "underline";
}

export function SimpleTabs({
  tabs,
  activeTab,
  onTabChange,
  fullWidth = true,
  primaryColor = THEME_COLORS.primary,
  tabStyle = "pill",
}: SimpleTabsProps) {
  // Animated value for the indicator
  const [indicatorPosition] = useState(new Animated.Value(0));
  const [indicatorWidth] = useState(new Animated.Value(0));

  // Function to handle tab press with animation
  const handleTabPress = (
    tabKey: string,
    index: number,
    tabWidth: number,
    tabPosition: number
  ) => {
    onTabChange(tabKey);

    // Animate the indicator
    Animated.parallel([
      Animated.timing(indicatorPosition, {
        toValue: tabPosition,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(indicatorWidth, {
        toValue: tabWidth,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Measure tab width and position for animation
  const measureTab = (event: any, tabKey: string, index: number) => {
    if (tabKey === activeTab) {
      const { width, x } = event.nativeEvent.layout;
      indicatorPosition.setValue(x);
      indicatorWidth.setValue(width);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tabsContainer, fullWidth && styles.fullWidth]}>
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              onLayout={(e) => measureTab(e, tab.key, index)}
              style={[
                styles.tab,
                fullWidth && styles.fullWidthTab,
                tabStyle === "pill" &&
                  isActive && {
                    backgroundColor: isActive
                      ? `${primaryColor}10`
                      : "transparent",
                  },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive
                    ? { color: primaryColor, fontWeight: "600" }
                    : styles.tabTextInactive,
                ]}
              >
                {tab.title}
              </Text>

              {tab.badge !== undefined && tab.badge > 0 && (
                <View style={[styles.badge, { backgroundColor: primaryColor }]}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {tabStyle === "underline" && (
          <Animated.View
            style={[
              styles.indicator,
              {
                backgroundColor: primaryColor,
                left: indicatorPosition,
                width: indicatorWidth,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  fullWidth: {
    justifyContent: "space-around",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidthTab: {
    flex: 1,
  },
  tabText: {
    fontSize: 14,
    textAlign: "center",
  },
  tabTextInactive: {
    color: "#6B7280",
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  indicator: {
    height: 3,
    position: "absolute",
    bottom: 0,
    borderRadius: 3,
  },
});
