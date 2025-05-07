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
import { useSegments, router, usePathname } from "expo-router";
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

export function CustomTabBar() {
  const segments = useSegments();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isAdminRoute = segments[0] === "(drawer)";

  // Modal state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Public routes (always visible in tab bar)
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
      path: "/admin/dashboard",
      color: "#4F46E5",
    },
    {
      id: "categories",
      name: "categories",
      label: "Categorias",
      icon: Grid,
      path: "/admin/products/categories",
      color: "#0891B2",
    },
    {
      id: "products",
      name: "products",
      label: "Produtos",
      icon: Package,
      path: "/admin/products",
      color: "#F59E0B",
    },
    {
      id: "profile",
      name: "profile",
      label: "Perfil",
      icon: User,
      path: "/admin/profile",
      color: "#EC4899",
    },
    {
      id: "destaques",
      name: "destaques",
      label: "Destaques",
      icon: Star,
      path: "/admin/destaques",
      color: "#10B981",
    },
    {
      id: "vitrine",
      name: "vitrine",
      label: "Vitrine",
      icon: ShoppingBag,
      path: "/admin/vitrine",
      color: "#8B5CF6",
    },
    {
      id: "delivery-config",
      name: "delivery-config",
      label: "Config. Delivery",
      icon: Settings,
      path: "/admin/delivery-config",
      color: "#6B7280",
    },
    {
      id: "encartes-admin",
      name: "encartes-admin",
      label: "Encartes Admin",
      icon: FileText,
      path: "/admin/encartes",
      color: "#EF4444",
    },
  ];

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path as any);
    setIsMenuOpen(false);
  };

  // Check if a route is active
  const isRouteActive = (routeName: string) => {
    // Para rotas públicas
    if (routeName === "comercio-local") {
      return pathname === "/(drawer)/(public-tabs)/comercio-local";
    } else if (routeName === "delivery") {
      return pathname === "/(drawer)/(public-tabs)/delivery";
    } else if (routeName === "encartes") {
      return pathname === "/(drawer)/(public-tabs)/encartes";
    }

    // Mesmo em rotas admin, ainda queremos destacar a tab pública
    // correspondente se existir uma relação
    if (
      isAdminRoute &&
      routeName === "encartes" &&
      pathname.includes("/admin/encartes")
    ) {
      return true;
    }

    return false;
  };

  // Group routes for expanded menu
  const mainAdminRoutes = adminRoutes.slice(0, 4); // First group
  const secondaryAdminRoutes = adminRoutes.slice(4); // Second group

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

              <View className="px-6 pt-2 pb-4">
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
                  className="max-h-[500px]"
                >
                  <View className="mb-5 bg-blue-50 p-3 rounded-xl">
                    <Text className="font-medium text-blue-800 mb-1 text-center">
                      Área Administrativa
                    </Text>
                    <Text className="text-xs text-blue-600 text-center">
                      Acesse as funcionalidades administrativas do seu comércio
                    </Text>
                  </View>

                  {isAuthenticated && (
                    <>
                      <RouteSection
                        title="Gerenciamento"
                        routes={mainAdminRoutes}
                        onItemPress={handleNavigation}
                      />

                      <RouteSection
                        title="Configurações & Marketing"
                        routes={secondaryAdminRoutes}
                        onItemPress={handleNavigation}
                      />

                      {/* Logout option */}
                      <View className="mt-6 mb-4 flex items-center justify-center">
                        <TouchableOpacity
                          className="p-2 flex-row items-center"
                          onPress={() => {
                            // Handle logout logic here
                            setIsMenuOpen(false);
                          }}
                        >
                          <Text className="font-medium mr-2 text-gray-500">
                            Sair da conta
                          </Text>
                          <LogOut size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {!isAuthenticated && (
                    <View className="py-8 items-center">
                      <Text className="text-gray-500 mb-4">
                        Faça login para acessar estas funcionalidades
                      </Text>
                      <TouchableOpacity
                        className="bg-primary-500 py-2 px-6 rounded-lg"
                        onPress={() => {
                          router.push("/(drawer)/(auth)/login");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Text className="text-white font-medium">Entrar</Text>
                      </TouchableOpacity>
                    </View>
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
          {/* Tab items - sempre mostra as rotas públicas */}
          {publicRoutes.map((route, index) => {
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

          {/* FAB button para menu */}
          <View className="absolute -top-6 right-6">
            <TouchableOpacity
              onPress={() => setIsMenuOpen(true)}
              className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center shadow-md"
              style={{
                elevation: 4,
              }}
            >
              <List size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
