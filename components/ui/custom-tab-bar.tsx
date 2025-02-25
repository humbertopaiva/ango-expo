// src/components/ui/custom-tab-bar.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  Store,
  Truck,
  FileText,
  Package,
  Grid,
  User,
  Star,
  BarChart,
  Settings,
  X,
  List,
  LogOut,
  ShoppingBag,
} from "lucide-react-native";
import { useSegments, router } from "expo-router";
import useAuthStore from "@/src/stores/auth";

interface RouteItem {
  id: string;
  name: string;
  label: string;
  icon: any;
  path: string;
  color?: string;
}

interface RouteSectionProps {
  title: string;
  routes: RouteItem[];
  onItemPress: (path: string) => void;
}

// Simple route section for the expanded menu
const RouteSection = ({ title, routes, onItemPress }: RouteSectionProps) => {
  return (
    <View className="mb-5">
      <Text className="text-lg font-semibold mb-3 text-gray-800 px-2">
        {title}
      </Text>
      <View className="flex-row flex-wrap">
        {routes.map((route) => (
          <TouchableOpacity
            key={route.id}
            onPress={() => onItemPress(route.path)}
            className="w-1/4 items-center mb-4"
          >
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center mb-1"
              style={{ backgroundColor: route.color || "#f3f4f6" }}
            >
              <route.icon
                size={22}
                color={route.color ? "#ffffff" : "#6B7280"}
              />
            </View>
            <Text className="text-xs text-center text-gray-700">
              {route.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

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
  const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isAdminRoute = segments[0] === "(app)";

  // Modal state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Public routes (always visible)
  const publicRoutes: RouteItem[] = [
    {
      id: "comercio-local",
      name: "comercio-local",
      label: "Comércio Local",
      icon: Store,
      path: "/(public)/comercio-local",
    },
    {
      id: "delivery",
      name: "delivery",
      label: "Delivery",
      icon: Truck,
      path: "/(public)/delivery",
    },
    {
      id: "encartes",
      name: "encartes",
      label: "Encartes",
      icon: FileText,
      path: "/(public)/encartes",
    },
  ];

  // Admin routes for expanded menu
  const adminRoutes: RouteItem[] = [
    {
      id: "dashboard",
      name: "dashboard",
      label: "Dashboard",
      icon: BarChart,
      path: "/(app)/admin/dashboard",
      color: "#4F46E5",
    },
    {
      id: "categories",
      name: "categories",
      label: "Categorias",
      icon: Grid,
      path: "/(app)/admin/categories",
      color: "#0891B2",
    },
    {
      id: "products",
      name: "products",
      label: "Produtos",
      icon: Package,
      path: "/(app)/admin/products",
      color: "#F59E0B",
    },
    {
      id: "profile",
      name: "profile",
      label: "Perfil",
      icon: User,
      path: "/(app)/admin/profile",
      color: "#EC4899",
    },
    {
      id: "destaques",
      name: "destaques",
      label: "Destaques",
      icon: Star,
      path: "/(app)/admin/destaques",
      color: "#10B981",
    },
    {
      id: "vitrine",
      name: "vitrine",
      label: "Vitrine",
      icon: ShoppingBag,
      path: "/(app)/admin/vitrine",
      color: "#8B5CF6",
    },
    {
      id: "delivery-config",
      name: "delivery-config",
      label: "Config. Delivery",
      icon: Settings,
      path: "/(app)/admin/delivery-config",
      color: "#6B7280",
    },
    {
      id: "encartes-admin",
      name: "encartes",
      label: "Encartes",
      icon: FileText,
      path: "/(app)/admin/encartes",
      color: "#EF4444",
    },
  ];

  // Determine which routes to show in the main toolbar
  const mainRoutes = isAdminRoute
    ? adminRoutes.slice(0, 3) // First 3 admin routes if in admin mode
    : publicRoutes; // Public routes if in public mode

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path as any);
    setIsMenuOpen(false);
  };

  // Toggle between admin and public mode
  const toggleMode = () => {
    if (isAdminRoute) {
      router.push("/(public)/comercio-local");
    } else {
      router.push("/(app)/admin/dashboard");
    }
    setIsMenuOpen(false);
  };

  // Check if a route is active
  const isRouteActive = (routeName: string) => {
    if (isAdminRoute) {
      return segments.includes(routeName as any);
    } else {
      const index = publicRoutes.findIndex((route) => route.name === routeName);
      return index === state.index;
    }
  };

  // Group routes for expanded menu
  const mainMenuRoutes = adminRoutes.slice(0, 4); // First group
  const secondaryMenuRoutes = adminRoutes.slice(4); // Second group

  return (
    <>
      {/* Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View className="flex-1 bg-black/60">
          <SafeAreaView className="flex-1 justify-end">
            <View className="bg-white rounded-t-3xl">
              <View className="w-full h-1 flex-row justify-center my-3">
                <View className="w-10 h-1 bg-gray-300 rounded-full" />
              </View>

              <View className="px-6 pt-2 pb-8">
                {/* Close button */}
                <View className="flex-row justify-end mb-2">
                  <TouchableOpacity
                    onPress={() => setIsMenuOpen(false)}
                    className="p-2"
                  >
                    <X size={24} color="#374151" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-96"
                >
                  {/* Admin/Public toggle button */}
                  <TouchableOpacity
                    onPress={toggleMode}
                    className="mb-5 flex-row items-center justify-center py-3 bg-gray-100 rounded-xl"
                  >
                    <Text className="font-medium mr-2">
                      {isAdminRoute
                        ? "Alternar para Modo Público"
                        : "Alternar para Modo Admin"}
                    </Text>
                    {isAdminRoute ? (
                      <Store size={18} color="#374151" />
                    ) : (
                      <Settings size={18} color="#374151" />
                    )}
                  </TouchableOpacity>

                  {isAuthenticated && (
                    <>
                      <RouteSection
                        title="Gerenciamento"
                        routes={mainMenuRoutes}
                        onItemPress={handleNavigation}
                      />

                      <RouteSection
                        title="Configurações & Marketing"
                        routes={secondaryMenuRoutes}
                        onItemPress={handleNavigation}
                      />

                      {/* Logout option */}
                      <TouchableOpacity
                        className="mt-2 p-3 flex-row items-center justify-center bg-gray-100 rounded-xl"
                        onPress={() => {
                          // Handle logout logic here
                          setIsMenuOpen(false);
                        }}
                      >
                        <Text className="font-medium mr-2 text-red-500">
                          Sair
                        </Text>
                        <LogOut size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Main Tab Bar */}
      <View className="absolute bottom-0 left-0 right-0 z-10">
        <View className="h-16 bg-white border-t border-gray-200 flex-row items-center justify-between px-4 relative">
          {/* Tab items */}
          {mainRoutes.map((route, index) => {
            const isActive = isRouteActive(route.name);
            return (
              <TouchableOpacity
                key={route.id}
                className="flex-1 items-center justify-center h-full"
                onPress={() => handleNavigation(route.path)}
              >
                <route.icon
                  size={22}
                  color={isActive ? "#0891B2" : "#6B7280"}
                />
                <Text
                  className={`text-xs mt-1 ${
                    isActive ? "text-primary-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {route.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* FAB button for authenticated users */}
          {isAuthenticated && (
            <View className="absolute -top-6 right-6">
              <TouchableOpacity
                onPress={() => setIsMenuOpen(true)}
                className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center"
                style={{
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <List size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
}
