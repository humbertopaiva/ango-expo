// src/components/ui/public-navigation.tsx
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
import { Menu, X, Store, Truck, FileText } from "lucide-react-native";
import { router, usePathname } from "expo-router";

const navigationItems = [
  {
    name: "comercio-local",
    label: "Comércio Local",
    icon: Store,
    path: "/(drawer)/(public-tabs)/comercio-local",
  },
  {
    name: "delivery",
    label: "Delivery",
    icon: Truck,
    path: "/(drawer)/(public-tabs)/delivery",
  },
  {
    name: "encartes",
    label: "Encartes",
    icon: FileText,
    path: "/(drawer)/(public-tabs)/encartes",
  },
];

export function PublicNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isWeb = Platform.OS === "web";

  const NavigationLink = ({
    item,
  }: {
    item: {
      name: string;
      label: string;
      icon: any;
      path: string;
    };
  }) => {
    const isActive = pathname === item.path;

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
        {/* Logo */}
        <View className="p-4 border-b border-gray-200">
          <Image
            source={require("@/assets/images/logo-white.png")}
            className="h-8 w-auto"
            resizeMode="contain"
          />
        </View>

        {/* Navigation Links */}
        <ScrollView className="flex-1 py-4">
          {navigationItems.map((item) => (
            <NavigationLink key={item.name} item={item} />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Mobile Header & Menu
  return (
    <>
      <View className="h-16 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 h-full">
          {/* Logo */}
          <Image
            source={require("@/assets/images/logo-white.png")}
            className="h-8 w-32"
            resizeMode="contain"
          />

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
                  Menu
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
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
