// src/components/ui/custom-tab-bar.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import {
  Settings,
  Store,
  Truck,
  FileText,
  Package,
  Grid,
  User,
} from "lucide-react-native";
import { useNavigation, router } from "expo-router";
import useAuthStore from "@/src/stores/auth";

interface Route {
  name: string;
  label: string;
  icon: any; // Ajuste o tipo conforme necessário
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = React.useRef(new Animated.Value(60)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const toggleExpand = () => {
    const toValue = isExpanded ? 60 : 180;

    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue,
        useNativeDriver: false,
        friction: 10,
      }),
      Animated.timing(fadeAnim, {
        toValue: isExpanded ? 0 : 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  const publicRoutes: Route[] = [
    {
      name: "comercio-local",
      label: "Comércio Local",
      icon: Store,
    },
    {
      name: "delivery",
      label: "Delivery",
      icon: Truck,
    },
    {
      name: "encartes",
      label: "Encartes",
      icon: FileText,
    },
  ];

  const adminRoutes: Route[] = [
    {
      name: "categories",
      label: "Categorias",
      icon: Grid,
    },
    {
      name: "products",
      label: "Produtos",
      icon: Package,
    },
    {
      name: "profile",
      label: "Perfil",
      icon: User,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <Animated.View
          className="absolute inset-0 bg-black"
          style={{
            opacity: fadeAnim,
          }}
          pointerEvents={isExpanded ? "auto" : "none"}
          onTouchStart={toggleExpand}
        />
      )}

      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
        style={{
          height: animatedHeight,
          elevation: 8, // Adiciona sombra no Android
          shadowColor: "#000", // Sombra no iOS
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        {/* Botão de configuração (FAB) */}
        {isAuthenticated && (
          <TouchableOpacity
            onPress={toggleExpand}
            className="absolute -top-6 right-6 w-12 h-12 bg-primary-500 rounded-full items-center justify-center"
            style={{
              transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
              elevation: 4, // Sombra Android
              shadowColor: "#000", // Sombra iOS
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <Settings size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Rotas Públicas */}
        <View className="flex-row h-[60px]">
          {publicRoutes.map((route, index) => {
            const isFocused = state.index === index;

            return (
              <TouchableOpacity
                key={route.name}
                onPress={() => router.push(`/(public)/${route.name}` as any)}
                className="flex-1 items-center justify-center"
              >
                <route.icon
                  size={24}
                  color={isFocused ? "#0891B2" : "#6B7280"}
                />
                <Text
                  className={`text-xs mt-1 ${
                    isFocused ? "text-primary-600" : "text-gray-500"
                  }`}
                >
                  {route.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Rotas Admin (Visíveis apenas quando expandido) */}
        {isExpanded && isAuthenticated && (
          <View className="flex-row flex-wrap justify-around py-4">
            {adminRoutes.map((route) => (
              <TouchableOpacity
                key={route.name}
                onPress={() => {
                  router.push(`/(app)/admin/${route.name}` as any);
                  toggleExpand();
                }}
                className="items-center justify-center w-1/3 mb-2"
              >
                <route.icon size={24} color="#6B7280" />
                <Text className="text-xs mt-1 text-gray-500">
                  {route.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    </>
  );
}
