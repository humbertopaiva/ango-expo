// src/components/ui/admin-navigation.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Menu,
  X,
  Grid,
  Package,
  User,
  Truck,
  Star,
  FileText,
  Settings,
} from "lucide-react-native";
import { router, usePathname } from "expo-router";

const navigationItems = [
  {
    name: "categories",
    label: "Categorias",
    icon: Grid,
    path: "/admin/products/categories",
  },
  {
    name: "products",
    label: "Produtos",
    icon: Package,
    path: "/admin/products",
  },
  {
    name: "delivery",
    label: "Delivery",
    icon: Truck,
    path: "/admin/delivery",
  },
  {
    name: "delivery-config",
    label: "Config. Entrega",
    icon: Settings,
    path: "/admin/delivery-config",
  },
  {
    name: "destaques",
    label: "Destaques",
    icon: Star,
    path: "/admin/destaques",
  },
  {
    name: "encartes",
    label: "Encartes",
    icon: FileText,
    path: "/admin/encartes",
  },
  {
    name: "profile",
    label: "Perfil",
    icon: User,
    path: "/admin/profile",
  },
  {
    name: "vitrine",
    label: "Vitrine",
    icon: Star,
    path: "/admin/vitrine",
  },
  {
    name: "leaflets",
    label: "Encartes",
    icon: FileText,
    path: "/admin/leaflets",
  },
];

export function AdminNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isWeb = Platform.OS === "web";

  interface NavigationItem {
    name: string;
    label: string;
    icon: any;
    path: string;
  }

  const NavigationLink = ({ item }: { item: NavigationItem }) => {
    const isActive = pathname.includes(item.path);

    return (
      <TouchableOpacity
        onPress={() => {
          router.push(item.path as any);
          if (!isWeb) setIsMenuOpen(false);
        }}
        className={`flex-row items-center p-4 ${isWeb ? "gap-4" : ""} ${
          isActive ? "bg-primary-50 border-r-4 border-primary-500" : ""
        }`}
      >
        <item.icon size={24} color={isActive ? "#0891B2" : "#6B7280"} />
        <Text
          className={`ml-3 text-base ${
            isActive ? "text-primary-600 font-medium" : "text-gray-600"
          }`}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Web Sidenav
  if (isWeb) {
    return (
      <View className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200">
        {/* Header com Logo */}
        <View className="p-4 border-b border-gray-200">
          <Image
            source={require("@/assets/images/logo-white.png")}
            className="h-8 w-auto"
            resizeMode="contain"
          />
          <Text className="mt-2 text-sm text-gray-500">
            Painel Administrativo
          </Text>
        </View>

        {/* Links de Navegação */}
        <ScrollView className="flex-1 py-4">
          {navigationItems.map((item) => (
            <NavigationLink key={item.name} item={item} />
          ))}
        </ScrollView>

        {/* Footer com informações do usuário */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.push("/admin/profile")}
          >
            <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
              <User size={16} color="#6B7280" />
            </View>
            <View className="ml-3">
              <Text className="text-sm font-medium text-gray-900">Admin</Text>
              <Text className="text-xs text-gray-500">Ver perfil</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Mobile Header & Menu
  return (
    <>
      <View className="h-16 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 h-full">
          {/* Logo */}
          <View>
            <Image
              source={require("@/assets/images/logo-white.png")}
              className="h-8 w-32"
              resizeMode="contain"
            />
            <Text className="text-xs text-gray-500">Admin</Text>
          </View>

          {/* Menu Button */}
          <TouchableOpacity onPress={() => setIsMenuOpen(true)} className="p-2">
            <Menu size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        visible={isMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View className="flex-1 bg-black/50">
          <SafeAreaView className="flex-1">
            <View className="bg-white h-4/5 mt-auto rounded-t-3xl overflow-hidden">
              {/* Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-900">
                  Menu Administrativo
                </Text>
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(false)}
                  className="p-2"
                >
                  <X size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <ScrollView className="flex-1 pt-2">
                {navigationItems.map((item) => (
                  <NavigationLink key={item.name} item={item} />
                ))}
              </ScrollView>

              {/* User Info */}
              <View className="p-4 border-t border-gray-200">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => {
                    router.push("/admin/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
                    <User size={16} color="#6B7280" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-sm font-medium text-gray-900">
                      Admin
                    </Text>
                    <Text className="text-xs text-gray-500">Ver perfil</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
