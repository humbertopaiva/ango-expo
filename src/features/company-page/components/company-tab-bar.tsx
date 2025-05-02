// Path: src/features/company-page/components/company-tab-bar.tsx
import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { usePathname, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, ShoppingBag, FileText, User } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { THEME_COLORS } from "@/src/styles/colors";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";

interface CompanyTabBarProps {
  activeTab: string;
}

export function CompanyTabBar({ activeTab }: CompanyTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const vm = useCompanyPageContext();
  const primaryColor = vm.primaryColor || THEME_COLORS.primary;

  // Obtém o slug da empresa da URL atual
  const companySlug = pathname.split("/")[2]; // Assumindo que o padrão é /empresa/[companySlug]/...

  // Usar o store diretamente para acessar a contagem correta de itens
  const { getItemCount } = useMultiCartStore();
  // Obter contagem de itens para o slug atual da empresa
  const cartItemsCount = companySlug ? getItemCount(companySlug) : 0;

  const tabs = [
    {
      key: "home",
      label: "Início",
      icon: Home,
      route: `/empresa/${companySlug}`,
    },
    {
      key: "cart",
      label: "Carrinho",
      icon: ShoppingBag,
      route: `/empresa/${companySlug}/cart`,
      enabled: vm.isCartEnabled(),
      badge: cartItemsCount > 0 ? cartItemsCount : undefined,
    },
    {
      key: "orders",
      label: "Pedidos",
      icon: FileText,
      route: `/empresa/${companySlug}/orders`,
    },
    {
      key: "profile",
      label: "Perfil",
      icon: User,
      route: `/empresa/${companySlug}/profile`,
    },
  ];

  // Filtra abas desabilitadas
  const enabledTabs = tabs.filter((tab) => tab.enabled !== false);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
    >
      {enabledTabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => router.push(tab.route as any)}
            className="flex-1 items-center justify-center py-2"
          >
            <View className="relative">
              {/* Badge para contagem de itens do carrinho */}
              {tab.badge && (
                <View
                  className="absolute z-40 -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: THEME_COLORS.primary,
                    opacity: 1,
                  }}
                >
                  <Text
                    className="text-[10px] text-white font-bold"
                    style={{ opacity: 1 }}
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </Text>
                </View>
              )}
              <Icon
                size={22}
                color={isActive ? primaryColor : "#64748B"}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </View>
            <Text
              className="text-xs mt-1"
              style={{
                color: isActive ? primaryColor : "#64748B",
                fontWeight: isActive ? "600" : "400",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
