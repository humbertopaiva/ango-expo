// Path: components/ui/elegant-tabs.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
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
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  centered?: boolean;
  animationDuration?: number;
  style?: any;
}

export function SimpleTabs({
  tabs,
  activeTab,
  onTabChange,
  primaryColor = THEME_COLORS.primary,
  secondaryColor = "#FFFFFF",
  textColor = "#374151",
  centered = true,
  animationDuration = 250,
  style,
}: SimpleTabsProps) {
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const [tabPositions, setTabPositions] = useState<{ [key: string]: number }>(
    {}
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Calcula a posição dos indicadores quando os tamanhos das abas ou a aba ativa mudam
  useEffect(() => {
    if (
      isLayoutReady &&
      activeTab &&
      tabWidths[activeTab] &&
      Object.keys(tabPositions).length > 0
    ) {
      const activeTabPosition = tabPositions[activeTab] || 0;
      const activeTabWidth = tabWidths[activeTab] || 0;

      // Anima o indicador para a posição da aba ativa
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: activeTabPosition,
          duration: animationDuration,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorWidth, {
          toValue: activeTabWidth,
          duration: animationDuration,
          useNativeDriver: false,
        }),
      ]).start();

      // Centraliza o scroll na aba ativa (para mobile)
      if (scrollViewRef.current) {
        const scrollTo =
          activeTabPosition - containerWidth / 2 + activeTabWidth / 2;
        scrollViewRef.current.scrollTo({
          x: Math.max(0, scrollTo),
          animated: true,
        });
      }
    }
  }, [activeTab, tabWidths, tabPositions, isLayoutReady]);

  // Manipula o layout para medir e posicionar as abas
  const handleTabLayout = (key: string, event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;

    // Atualiza a largura da aba
    setTabWidths((prev) => ({
      ...prev,
      [key]: width,
    }));

    // Atualiza a posição da aba
    setTabPositions((prev) => ({
      ...prev,
      [key]: x,
    }));

    // Verifica se todas as medições foram concluídas
    if (
      Object.keys(tabWidths).length === tabs.length &&
      Object.keys(tabPositions).length === tabs.length
    ) {
      setIsLayoutReady(true);
    }
  };

  // Mede a largura do contêiner
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[{ overflow: "hidden" }, style]}
      onLayout={handleContainerLayout}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: centered ? "center" : "flex-start",
        }}
      >
        <View className="flex-row items-center relative">
          {/* Abas */}
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              onLayout={(e) => handleTabLayout(tab.key, e)}
              activeOpacity={0.7}
              className={`px-6 py-3`}
            >
              <View className="flex-row items-center">
                <Text
                  className={`text-base ${
                    activeTab === tab.key ? "font-semibold" : "font-medium"
                  }`}
                  style={{
                    color: activeTab === tab.key ? primaryColor : textColor,
                    opacity: activeTab === tab.key ? 1 : 0.7,
                  }}
                >
                  {tab.title}
                </Text>

                {/* Badge (se existir) */}
                {tab.badge !== undefined && (
                  <View
                    className="ml-2 rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor:
                        activeTab === tab.key
                          ? primaryColor
                          : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <Text
                      className="text-xs"
                      style={{
                        color:
                          activeTab === tab.key ? "white" : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {tab.badge}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Indicador animado */}
          {isLayoutReady && (
            <Animated.View
              className="absolute bottom-0 h-0.5 rounded-full"
              style={{
                backgroundColor: primaryColor,
                width: indicatorWidth,
                transform: [{ translateX }],
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
