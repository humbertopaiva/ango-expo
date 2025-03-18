// Path: components/navigation/custom-tab-bar.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { usePathname, router } from "expo-router";
import { Store, Truck, FileText } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME_COLORS } from "@/src/styles/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";

interface TabItem {
  name: string;
  label: string;
  icon: any;
  path: string;
}

export function CustomTabBar(_props: BottomTabBarProps) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const windowWidth = Dimensions.get("window").width;

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef({} as Record<string, Animated.Value>);

  // Itens do menu de navegação
  const tabs: TabItem[] = [
    {
      name: "comercio-local",
      label: "Comércio",
      icon: Store,
      path: "/(drawer)/(tabs)/comercio-local",
    },
    {
      name: "delivery",
      label: "Delivery",
      icon: Truck,
      path: "/(drawer)/(tabs)/delivery",
    },
    {
      name: "encartes",
      label: "Encartes",
      icon: FileText,
      path: "/(drawer)/(tabs)/encartes",
    },
  ];

  // Inicializar animações para cada aba
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!scaleAnim.current[tab.name]) {
        scaleAnim.current[tab.name] = new Animated.Value(1);
      }
    });

    // Animação de entrada da TabBar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Verificar se um tab está ativo
  const isActive = (path: string) => {
    const pathSegments = path.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return pathname.includes(lastSegment);
  };

  const handleNavigation = (path: any, tabName: string) => {
    // Animar o tab sendo pressionado
    Animated.sequence([
      Animated.timing(scaleAnim.current[tabName], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim.current[tabName], {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim.current[tabName], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    router.push(path);
  };

  // No ambiente web, usamos uma barra horizontal na parte superior
  if (isWeb) {
    return (
      <Animated.View
        style={[
          styles.webContainer,
          {
            backgroundColor: THEME_COLORS.primary,
            opacity: fadeAnim,
            transform: [{ translateY: translateY }],
          },
        ]}
      >
        <LinearGradient
          colors={[THEME_COLORS.primary, THEME_COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.webGradient}
        >
          <View style={styles.webTabsContainer}>
            {tabs.map((tab) => {
              const active = isActive(tab.path);
              const scaleAnimValue =
                scaleAnim.current[tab.name] || new Animated.Value(1);

              return (
                <Animated.View
                  key={tab.name}
                  style={{
                    transform: [{ scale: scaleAnimValue }],
                  }}
                >
                  <TouchableOpacity
                    style={[styles.webTab, active && styles.webTabActive]}
                    onPress={() => handleNavigation(tab.path, tab.name)}
                  >
                    {active ? (
                      <LinearGradient
                        colors={["#FFFFFF", "#F8F8F8"]}
                        style={styles.webIconContainerActive}
                      >
                        <tab.icon size={22} color={THEME_COLORS.primary} />
                      </LinearGradient>
                    ) : (
                      <View style={styles.webIconContainer}>
                        <tab.icon size={22} color="#FFFFFF" />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.webTabText,
                        active && styles.webTabTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>

                    {active && <View style={styles.webIndicator} />}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  // Para mobile, usamos agora um layout minimalista e horizontal
  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          opacity: fadeAnim,
          transform: [
            {
              translateY: Animated.multiply(translateY, new Animated.Value(-1)),
            },
          ],
        },
      ]}
    >
      <View style={styles.background}>
        <LinearGradient
          colors={[THEME_COLORS.primary, THEME_COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const active = isActive(tab.path);
              const scaleAnimValue =
                scaleAnim.current[tab.name] || new Animated.Value(1);

              return (
                <Animated.View
                  key={tab.name}
                  style={[
                    styles.tabWrapper,
                    {
                      transform: [{ scale: scaleAnimValue }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.tab, active && styles.activeTab]}
                    onPress={() => handleNavigation(tab.path, tab.name)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={
                        active
                          ? styles.activeIconContainer
                          : styles.iconContainer
                      }
                    >
                      <tab.icon
                        size={22}
                        color={active ? THEME_COLORS.primary : "#FFFFFF"}
                      />
                    </View>
                    <Text
                      style={[styles.tabText, active && styles.activeTabText]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  gradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "100%",
    height: "100%",
  },

  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,

    overflow: "hidden",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 8,
  },
  activeIconContainer: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  activeTabText: {
    color: THEME_COLORS.primary,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  // Estilos para web
  webContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  webGradient: {
    paddingVertical: 4,
  },
  webTabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: 1200,
    marginHorizontal: "auto",
    width: "100%",
    paddingVertical: 8,
  },
  webTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 8,
    position: "relative",
  },
  webTabActive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  webIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  webIconContainerActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  webTabText: {
    marginLeft: 12,
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  webTabTextActive: {
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  webIndicator: {
    position: "absolute",
    bottom: -2,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
