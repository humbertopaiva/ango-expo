// Path: components/navigation/custom-drawer-content.tsx

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { router, useNavigation, usePathname } from "expo-router";
import useAuthStore from "@/src/stores/auth";
import {
  Home,
  Settings,
  LogIn,
  LogOut,
  HelpCircle,
  Info,
  Package,
  X,
  Store,
  FileText,
  BarChart2,
  ShoppingBag,
  User,
  LayoutPanelLeft,
  User2,
  SquareMenu,
} from "lucide-react-native";
import { DrawerActions } from "@react-navigation/native";
import { THEME_COLORS } from "@/src/styles/colors";
import { Box, Divider, HStack, VStack } from "@gluestack-ui/themed";
import { useCompanyData } from "@/src/hooks/use-company-data";
import { ResilientImage } from "../common/resilient-image";
import { cacheService } from "@/src/services/cache-service";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const profile = useAuthStore((state) => state.profile);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { company, loading, clearCompanyData } = useCompanyData();
  const prevAuthState = useRef(isAuthenticated);
  const prevCompanyId = useRef(profile?.company_id);

  const primaryColor = THEME_COLORS.primary;

  // Verificar mudanças de autenticação ou ID da empresa
  useEffect(() => {
    const authChanged = prevAuthState.current !== isAuthenticated;
    const companyIdChanged = prevCompanyId.current !== profile?.company_id;

    prevAuthState.current = isAuthenticated;
    prevCompanyId.current = profile?.company_id;

    // Não fazer nada se não houve mudança
    if (!authChanged && !companyIdChanged) {
      return;
    }

    // Limpar dados da empresa se o usuário fez logout
    if (authChanged && !isAuthenticated) {
      clearCompanyData();
    }
  }, [isAuthenticated, profile, clearCompanyData]);

  // Handler para navegação
  const handleNavigation = (path: string) => {
    // Primeiro feche o drawer - deixe isso fora do try-catch
    try {
      navigation.dispatch(DrawerActions.closeDrawer());
    } catch (error) {
      console.log("Warning: Não foi possível fechar o drawer:", error);
    }

    // Depois navegue para o caminho - com um pequeno delay para garantir uma boa UX
    setTimeout(() => {
      router.push(path as any);
    }, 50);
  };

  // Verificar se um item está ativo
  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    // Primeiro fechar o drawer
    try {
      navigation.dispatch(DrawerActions.closeDrawer());
    } catch (error) {
      console.log("Erro ao fechar drawer:", error);
    }

    // Limpar o cache para a empresa atual
    if (profile?.company_id) {
      await cacheService.remove(`company_${profile.company_id}`);
      clearCompanyData(); // Limpar dados em memória também
    }

    // Limpar autenticação e redirecionar
    clearAuth();
    router.replace("/(drawer)/(tabs)/comercio-local");
  };

  const handleLogin = () => {
    router.push("/(drawer)/(auth)/login");
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const handleCloseDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.closeDrawer());
    } catch (error) {
      console.log("Erro ao fechar drawer:", error);
    }
  };

  // Itens do menu para navegação pública
  const publicMenuItems = [
    {
      label: "Início",
      icon: Home,
      path: "/(drawer)/(tabs)/comercio-local",
    },
    {
      label: "Delivery",
      icon: ShoppingBag,
      path: "/(drawer)/(tabs)/delivery",
    },
    {
      label: "Encartes",
      icon: FileText,
      path: "/(drawer)/(tabs)/encartes",
    },
    {
      label: "Meu Perfil",
      icon: User,
      path: "/(drawer)/profile",
    },
    {
      label: "Suporte",
      icon: HelpCircle,
      path: "/(drawer)/support",
    },
    {
      label: "Quem Somos",
      icon: Info,
      path: "/(drawer)/about",
    },
    {
      label: "Meus Pedidos",
      icon: ShoppingBag,
      path: "/(drawer)/orders",
    },
  ];

  // Itens do menu para área administrativa
  const adminMenuItems = [
    {
      label: "Painel Inicial",
      icon: SquareMenu,
      path: "/(drawer)/admin/dashboard",
    },
    {
      label: "Categorias",
      icon: Store,
      path: "/(drawer)/admin/categories",
    },
    {
      label: "Produtos",
      icon: Package,
      path: "/(drawer)/admin/products",
    },
    {
      label: "Vitrine",
      icon: ShoppingBag,
      path: "/(drawer)/admin/vitrine",
    },
    {
      label: "Encartes",
      icon: FileText,
      path: "/(drawer)/admin/leaflets",
    },
    {
      label: "Config. do Perfil",
      icon: User2,
      path: "/(drawer)/admin/profile",
    },
    {
      label: "Config. do App",
      icon: LayoutPanelLeft,
      path: "/(drawer)/admin/delivery-config",
    },
  ];

  // Renderizar um item do menu
  const renderMenuItem = (item: { label: string; icon: any; path: string }) => {
    const active = isActive(item.path);
    const Icon = item.icon;

    return (
      <TouchableOpacity
        key={item.path}
        onPress={() => handleNavigation(item.path)}
        className={`flex-row items-center py-3 px-4 mb-1 ${
          active ? "bg-primary-50 rounded-lg" : ""
        }`}
      >
        <Icon size={20} color={active ? primaryColor : "#64748b"} />
        <Text
          className={`ml-3 ${
            active ? "text-primary-600 font-medium" : "text-slate-600"
          }`}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? insets.top : 0,
      }}
    >
      {/* Header */}
      <HStack
        className="py-8"
        borderBottomWidth={1}
        borderBottomColor="#f1f5f9"
      >
        <Image
          source={require("@/assets/images/limei-1.png")}
          style={{ height: 24, width: 120 }}
          resizeMode="contain"
        />
      </HStack>

      {/* Perfil (se autenticado) */}
      {isAuthenticated && company && (
        <View className="px-4 py-4 border-b border-slate-100">
          <HStack space="md" alignItems="center">
            <View className="bg-primary-50 w-12 h-12 rounded-full items-center justify-center overflow-hidden">
              {company?.logo ? (
                <ResilientImage
                  source={company.logo}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <User size={22} color={primaryColor} />
              )}
            </View>

            <VStack>
              <Text className="font-semibold text-slate-800">
                {company?.nome || "Minha Empresa"}
              </Text>
            </VStack>
          </HStack>
        </View>
      )}

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        // Path: components/navigation/custom-drawer-content.tsx (continuação)
        <View className="px-2 pt-2">
          <Text className="text-xs font-medium text-slate-400 px-4 py-2 uppercase">
            Navegação
          </Text>

          {publicMenuItems.map(renderMenuItem)}
        </View>
        {/* Seção de administração (se autenticado) */}
        {isAuthenticated && (
          <View className="mt-4 px-2">
            <Text className="text-xs font-medium text-slate-400 px-4 py-2 uppercase">
              Administração
            </Text>

            {adminMenuItems.map(renderMenuItem)}
          </View>
        )}
      </DrawerContentScrollView>

      {/* Footer com botão de login/logout */}
      <View className="px-4 py-4 border-t border-slate-100">
        {isAuthenticated ? (
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center py-3 px-2"
          >
            <LogOut size={20} color="#ef4444" />
            <Text className="ml-3 text-red-500 font-medium">Sair da conta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            className="flex-row items-center py-3 px-2"
          >
            <LogIn size={20} color={primaryColor} />
            <Text className="ml-3 text-primary-600 font-medium">Entrar</Text>
          </TouchableOpacity>
        )}

        <Text className="text-center text-xs text-slate-400 mt-4">
          Versão 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
